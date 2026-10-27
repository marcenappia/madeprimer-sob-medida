import express, { type Express, type Request, type Response } from "express";
import { saveQuoteAttachment } from "./data";

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);

function safeOriginalName(value: string | undefined) {
  if (!value) return "referencia";
  let decoded = value;
  try { decoded = decodeURIComponent(value); } catch { return "referencia"; }
  const name = decoded.split(/[\\/]/).pop()?.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, 255);
  return name || "referencia";
}

function validSignature(type: string, bytes: Buffer) {
  if (type === "application/pdf") return bytes.subarray(0, 5).toString("ascii") === "%PDF-";
  if (type === "image/png") return bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (type === "image/jpeg") return bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === "image/webp") return bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP";
  return false;
}

export function registerQuoteUploadRoute(app: Express) {
  app.put(
    "/api/quotes/:quoteId/attachments",
    (req: Request, res: Response, next) => {
      const type = (req.headers["content-type"] ?? "").split(";")[0].toLowerCase();
      if (!allowedTypes.has(type)) {
        res.status(415).json({ error: "Formato de arquivo não aceito. Use JPG, PNG, WebP ou PDF." });
        return;
      }
      express.raw({ type: () => true, limit: MAX_FILE_BYTES })(req, res, (error) => {
        if (error) {
          res.status(413).json({ error: "O arquivo deve ter no máximo 10 MB." });
          return;
        }
        next();
      });
    },
    async (req: Request, res: Response) => {
      try {
        const quoteId = Number(req.params.quoteId);
        const token = req.header("x-upload-ticket") ?? "";
        const type = (req.headers["content-type"] ?? "").split(";")[0].toLowerCase();
        const bytes = Buffer.isBuffer(req.body) ? req.body : Buffer.alloc(0);
        if (!Number.isSafeInteger(quoteId) || quoteId < 1 || token.length !== 64 || !/^[a-f0-9]+$/i.test(token)) {
          res.status(400).json({ error: "Solicitação de arquivo inválida" });
          return;
        }
        if (bytes.length === 0 || bytes.length > MAX_FILE_BYTES || !validSignature(type, bytes)) {
          res.status(400).json({ error: "Arquivo vazio, acima de 10 MB ou com conteúdo incompatível" });
          return;
        }
        await saveQuoteAttachment({
          quoteId,
          token,
          originalName: safeOriginalName(req.header("x-file-name") ?? undefined),
          contentType: type,
          bytes,
        });
        res.status(201).json({ success: true });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Falha no upload";
        const authorizationFailure = /authorization|expired/i.test(message);
        if (!authorizationFailure) console.error("[QuoteUpload] Upload failed", message.slice(0, 200));
        res.status(authorizationFailure ? 403 : 500).json({
          error: authorizationFailure ? "Autorização do envio expirada" : "Não foi possível armazenar o anexo. Tente novamente.",
        });
      }
    },
  );
}
