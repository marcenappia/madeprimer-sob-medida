import { createHash, randomBytes, randomUUID } from "node:crypto";
import { and, desc, eq, gt, isNull, lt, sql } from "drizzle-orm";
import { adminAudit, inventoryMovements, managedRecords, quoteAttachments, quoteStatusHistory, quoteUploadTickets, quotes, siteSettings } from "../drizzle/schema";
import type { QuoteInput, RecordModule, RecordValues } from "../shared/types";
import { requireDb } from "./db";
import { storageGetSignedUrl, storagePut } from "./storage";

const SETTINGS_KEYS = new Set(["phonePrimary", "phoneSecondary", "address"]);
const safeCount = (value: unknown) => Number(value ?? 0);
const tokenHash = (token: string) => createHash("sha256").update(token).digest("hex");

export async function createQuote(input: QuoteInput) {
  const db = await requireDb();
  const reference = `MP-${randomBytes(4).toString("hex").toUpperCase()}`;
  const [result] = await db.insert(quotes).values({
    reference,
    projectType: input.projectType,
    objective: input.objective,
    city: input.city,
    measurements: input.measurements || null,
    desiredTimeline: input.desiredTimeline || null,
    budgetRange: input.budgetRange || null,
    message: input.message || null,
    fullName: input.fullName,
    phone: input.phone,
    email: input.email,
    privacyAcceptedAt: new Date(),
  });
  const quoteId = Number((result as { insertId?: number }).insertId);
  if (!quoteId) throw new Error("Quote insert did not return its identifier");
  if (input.attachmentCount > 0) {
    const token = randomBytes(32).toString("hex");
    await db.insert(quoteUploadTickets).values({
      quoteId,
      tokenHash: tokenHash(token),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    });
    return { quoteId, reference, uploadToken: token };
  }
  return { quoteId, reference, uploadToken: null };
}

export async function saveQuoteAttachment(args: {
  quoteId: number;
  token: string;
  originalName: string;
  contentType: string;
  bytes: Buffer;
}) {
  const db = await requireDb();
  const hash = tokenHash(args.token);
  const [ticket] = await db.select().from(quoteUploadTickets).where(
    and(eq(quoteUploadTickets.quoteId, args.quoteId), eq(quoteUploadTickets.tokenHash, hash), gt(quoteUploadTickets.expiresAt, new Date())),
  ).limit(1);
  if (!ticket) throw new Error("Upload authorization is invalid or expired");

  const reservation = await db.update(quoteUploadTickets)
    .set({ uploadCount: sql`${quoteUploadTickets.uploadCount} + 1` })
    .where(and(eq(quoteUploadTickets.id, ticket.id), gt(quoteUploadTickets.expiresAt, new Date()), lt(quoteUploadTickets.uploadCount, 6)));
  const reservationHeader = (Array.isArray(reservation) ? reservation[0] : reservation) as { affectedRows?: number };
  if (Number(reservationHeader?.affectedRows ?? 0) !== 1) throw new Error("Upload authorization is invalid or expired");

  const key = `quotes/${args.quoteId}/${randomUUID()}.${extensionForMime(args.contentType)}`;
  let stored: Awaited<ReturnType<typeof storagePut>>;
  try {
    stored = await storagePut(key, args.bytes, args.contentType);
  } catch (error) {
    await db.update(quoteUploadTickets).set({ uploadCount: sql`GREATEST(${quoteUploadTickets.uploadCount} - 1, 0)` }).where(eq(quoteUploadTickets.id, ticket.id));
    throw error;
  }
  try {
    await db.insert(quoteAttachments).values({
      quoteId: args.quoteId,
      storageKey: stored.key,
      originalName: args.originalName,
      contentType: args.contentType,
      byteSize: args.bytes.byteLength,
    });
  } catch (error) {
    // The storage API has no runtime delete operation; don't log the private key.
    throw new Error("Attachment metadata could not be saved");
  }
  return { ok: true as const };
}

function extensionForMime(contentType: string) {
  if (contentType === "image/jpeg") return "jpg";
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  return "pdf";
}

export async function getPublicSettings() {
  const db = await requireDb();
  const rows = await db.select().from(siteSettings);
  const settings: Record<string, string> = {};
  for (const row of rows) if (SETTINGS_KEYS.has(row.settingKey)) settings[row.settingKey] = row.settingValue;
  return settings;
}

export async function saveSiteSetting(key: string, value: string, userId: number) {
  if (!SETTINGS_KEYS.has(key)) throw new Error("This setting is not editable");
  const db = await requireDb();
  await db.insert(siteSettings).values({ settingKey: key, settingValue: value, updatedBy: userId }).onDuplicateKeyUpdate({
    set: { settingValue: value, updatedBy: userId, updatedAt: new Date() },
  });
  await recordAdminAction(userId, "update", "settings", null, `Atualizou ${key}`);
  return { ok: true as const };
}

export async function listPublicRecords(module: "projects" | "partners") {
  const db = await requireDb();
  const publicStatus = module === "projects" ? "published" : "active";
  return db.select({ id: managedRecords.id, title: managedRecords.title, category: managedRecords.category,
    description: managedRecords.description, url: managedRecords.url, data: managedRecords.data })
    .from(managedRecords)
    .where(and(eq(managedRecords.module, module), eq(managedRecords.status, publicStatus), isNull(managedRecords.archivedAt)))
    .orderBy(managedRecords.sortOrder, desc(managedRecords.createdAt)).limit(60);
}

export async function listAdminRecords(module: RecordModule) {
  const db = await requireDb();
  return db.select().from(managedRecords)
    .where(and(eq(managedRecords.module, module), isNull(managedRecords.archivedAt)))
    .orderBy(desc(managedRecords.updatedAt)).limit(200);
}

function cleanText(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}
function parseMoney(value: unknown): number {
  const text = cleanText(value, 24).replace(",", ".");
  if (!/^\d{1,8}(?:\.\d{1,2})?$/.test(text)) throw new Error("Informe um valor financeiro válido");
  const cents = Math.round(Number(text) * 100);
  if (!Number.isSafeInteger(cents) || cents < 0 || cents > 2_000_000_000) throw new Error("Valor financeiro fora do limite");
  return cents;
}
function parseWholeNumber(value: unknown, label: string) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 0 || number > 1_000_000) throw new Error(`${label} deve ser um número inteiro entre 0 e 1.000.000`);
  return number;
}

export function normalizeRecord(module: RecordModule, input: Record<string, unknown>): RecordValues {
  const title = cleanText(input.title, 180);
  if (title.length < 2) throw new Error("Informe um título com pelo menos 2 caracteres");
  const description = cleanText(input.description, 5000);
  const category = cleanText(input.category, 120) || null;
  const allowedStatus = module === "projects" || module === "testimonials" ? ["draft", "published"]
    : module === "finance" ? ["confirmed", "pending"] : ["active", "inactive"];
  const status = cleanText(input.status, 24) || (module === "projects" || module === "testimonials" ? "draft" : "active");
  if (!allowedStatus.includes(status)) throw new Error("Status inválido para este módulo");

  let amountCents: number | null = null;
  let direction: string | null = null;
  let quantity: number | null = null;
  let minimumQuantity: number | null = null;
  let unit: string | null = null;
  let url: string | null = null;
  const data: Record<string, string | number | boolean | null> = {};

  if (module === "finance") {
    amountCents = parseMoney(input.amount);
    direction = input.direction === "expense" ? "expense" : input.direction === "income" ? "income" : null;
    if (!direction) throw new Error("Escolha receita ou despesa");
    const date = cleanText(input.date, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T12:00:00Z`))) throw new Error("Informe uma data válida");
    data.date = date;
  }
  if (module === "stock") {
    quantity = parseWholeNumber(input.quantity, "Quantidade");
    minimumQuantity = parseWholeNumber(input.minimumQuantity, "Estoque mínimo");
    unit = cleanText(input.unit, 32) || "un";
    data.sku = cleanText(input.sku, 80);
  }
  if (module === "team") {
    const email = cleanText(input.email, 320);
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("E-mail inválido");
    data.email = email;
    data.phone = cleanText(input.phone, 40);
  }
  if (module === "projects" || module === "partners") {
    url = cleanText(input.url, 2048) || null;
    if (url) {
      try {
        const parsed = new URL(url);
        if (parsed.protocol !== "https:" && parsed.protocol !== "http:") throw new Error();
      } catch { throw new Error("Informe uma URL HTTP ou HTTPS válida"); }
    }
  }
  for (const [key, value] of Object.entries(input)) {
    if (["title", "description", "category", "status", "amount", "direction", "quantity", "minimumQuantity", "unit", "url", "date", "email", "phone", "sku"].includes(key)) continue;
    if (typeof value === "string") data[key.slice(0, 40)] = value.trim().slice(0, 1000);
    else if (typeof value === "number" && Number.isFinite(value)) data[key.slice(0, 40)] = value;
    else if (typeof value === "boolean" || value === null) data[key.slice(0, 40)] = value;
  }
  return { title, description, category, status, amountCents, direction, quantity, minimumQuantity, unit, url, data };
}

export async function saveAdminRecord(module: RecordModule, input: Record<string, unknown>, userId: number, id?: number) {
  const db = await requireDb();
  const value = normalizeRecord(module, input);
  if (id) {
    await db.update(managedRecords).set({ ...value, updatedAt: new Date() })
      .where(and(eq(managedRecords.id, id), eq(managedRecords.module, module), isNull(managedRecords.archivedAt)));
    await recordAdminAction(userId, "update", module, id, `Atualizou ${value.title}`);
    return { id, ...value };
  }
  const [result] = await db.insert(managedRecords).values({ ...value, module, createdBy: userId, sortOrder: 0 });
  const newId = Number((result as { insertId?: number }).insertId);
  await recordAdminAction(userId, "create", module, newId, `Criou ${value.title}`);
  return { id: newId, ...value };
}

export async function archiveAdminRecord(id: number, userId: number) {
  const db = await requireDb();
  const [existing] = await db.select({ id: managedRecords.id, module: managedRecords.module, title: managedRecords.title })
    .from(managedRecords).where(and(eq(managedRecords.id, id), isNull(managedRecords.archivedAt))).limit(1);
  if (!existing) throw new Error("Registro não encontrado");
  await db.update(managedRecords).set({ archivedAt: new Date(), status: "archived" }).where(eq(managedRecords.id, id));
  await recordAdminAction(userId, "archive", existing.module, id, `Arquivou ${existing.title}`);
  return { ok: true as const };
}

export async function listQuotes() {
  const db = await requireDb();
  const quoteRows = await db.select().from(quotes).orderBy(desc(quotes.createdAt)).limit(200);
  const attachmentRows = await db.select({ id: quoteAttachments.id, quoteId: quoteAttachments.quoteId,
    originalName: quoteAttachments.originalName, contentType: quoteAttachments.contentType,
    byteSize: quoteAttachments.byteSize, createdAt: quoteAttachments.createdAt })
    .from(quoteAttachments).where(isNull(quoteAttachments.deletedAt));
  const byQuote = new Map<number, typeof attachmentRows>();
  for (const attachment of attachmentRows) byQuote.set(attachment.quoteId, [...(byQuote.get(attachment.quoteId) ?? []), attachment]);
  return quoteRows.map((quote) => ({ ...quote, attachments: byQuote.get(quote.id) ?? [] }));
}

export async function updateQuoteStatus(input: { id: number; status: "new" | "contacted" | "converted" | "lost"; valueCents?: number | null; note?: string }, userId: number) {
  const db = await requireDb();
  const [current] = await db.select().from(quotes).where(eq(quotes.id, input.id)).limit(1);
  if (!current) throw new Error("Orçamento não encontrado");
  if (input.valueCents !== undefined && (input.valueCents !== null && (!Number.isInteger(input.valueCents) || input.valueCents < 0 || input.valueCents > 2_000_000_000))) throw new Error("Valor fora do limite");
  await db.update(quotes).set({ status: input.status, estimatedValueCents: input.valueCents ?? current.estimatedValueCents, updatedAt: new Date() }).where(eq(quotes.id, input.id));
  await db.insert(quoteStatusHistory).values({ quoteId: input.id, actorUserId: userId, fromStatus: current.status,
    toStatus: input.status, note: cleanText(input.note, 500) || null });
  await recordAdminAction(userId, "update_status", "quotes", input.id, `Atualizou status do orçamento ${current.reference}`);
  return { ok: true as const };
}

export async function getAttachmentDownloadUrl(id: number) {
  const db = await requireDb();
  const [row] = await db.select({ key: quoteAttachments.storageKey })
    .from(quoteAttachments).where(and(eq(quoteAttachments.id, id), isNull(quoteAttachments.deletedAt))).limit(1);
  if (!row) throw new Error("Anexo não encontrado");
  return storageGetSignedUrl(row.key);
}

export async function getAdminOverview() {
  const db = await requireDb();
  const [quoteCount] = await db.select({ value: sql<number>`COUNT(*)` }).from(quotes);
  const [newQuoteCount] = await db.select({ value: sql<number>`COUNT(*)` }).from(quotes).where(eq(quotes.status, "new"));
  const [converted] = await db.select({ value: sql<number>`COALESCE(SUM(${quotes.estimatedValueCents}), 0)` })
    .from(quotes).where(eq(quotes.status, "converted"));
  const [projectCount] = await db.select({ value: sql<number>`COUNT(*)` }).from(managedRecords)
    .where(and(eq(managedRecords.module, "projects"), eq(managedRecords.status, "published"), isNull(managedRecords.archivedAt)));
  const [testimonialCount] = await db.select({ value: sql<number>`COUNT(*)` }).from(managedRecords)
    .where(and(eq(managedRecords.module, "testimonials"), eq(managedRecords.status, "published"), isNull(managedRecords.archivedAt)));
  const [income] = await db.select({ value: sql<number>`COALESCE(SUM(${managedRecords.amountCents}), 0)` }).from(managedRecords)
    .where(and(eq(managedRecords.module, "finance"), eq(managedRecords.direction, "income"), eq(managedRecords.status, "confirmed"), isNull(managedRecords.archivedAt)));
  const [expense] = await db.select({ value: sql<number>`COALESCE(SUM(${managedRecords.amountCents}), 0)` }).from(managedRecords)
    .where(and(eq(managedRecords.module, "finance"), eq(managedRecords.direction, "expense"), eq(managedRecords.status, "confirmed"), isNull(managedRecords.archivedAt)));
  const recentQuotes = await db.select({ id: quotes.id, reference: quotes.reference, projectType: quotes.projectType,
    city: quotes.city, status: quotes.status, createdAt: quotes.createdAt }).from(quotes).orderBy(desc(quotes.createdAt)).limit(5);
  const lowStock = await db.select({ id: managedRecords.id, title: managedRecords.title, quantity: managedRecords.quantity,
    minimumQuantity: managedRecords.minimumQuantity }).from(managedRecords).where(and(eq(managedRecords.module, "stock"), isNull(managedRecords.archivedAt)));
  return {
    quoteCount: safeCount(quoteCount?.value), newQuoteCount: safeCount(newQuoteCount?.value),
    convertedRevenueCents: safeCount(converted?.value), projectCount: safeCount(projectCount?.value),
    testimonialCount: safeCount(testimonialCount?.value), incomeCents: safeCount(income?.value),
    expenseCents: safeCount(expense?.value), netCents: safeCount(income?.value) - safeCount(expense?.value),
    lowStock: lowStock.filter((row) => row.quantity !== null && row.minimumQuantity !== null && row.quantity <= row.minimumQuantity),
    recentQuotes,
  };
}

export async function getReportData() {
  const db = await requireDb();
  const finance = await db.select().from(managedRecords)
    .where(and(eq(managedRecords.module, "finance"), isNull(managedRecords.archivedAt))).orderBy(desc(managedRecords.createdAt)).limit(1000);
  const statuses = await db.select({ status: quotes.status, total: sql<number>`COUNT(*)` }).from(quotes).groupBy(quotes.status);
  return { finance, quoteStatuses: statuses.map((row) => ({ status: row.status, total: safeCount(row.total) })) };
}

export async function listSettings() {
  const db = await requireDb();
  const rows = await db.select().from(siteSettings).orderBy(siteSettings.settingKey);
  return rows.filter((row) => SETTINGS_KEYS.has(row.settingKey));
}

export async function adjustStock(input: { id: number; delta: number; note?: string }, userId: number) {
  if (!Number.isInteger(input.delta) || input.delta === 0 || Math.abs(input.delta) > 1_000_000) throw new Error("Movimentação inválida");
  const db = await requireDb();
  const [item] = await db.select().from(managedRecords).where(and(eq(managedRecords.id, input.id), eq(managedRecords.module, "stock"), isNull(managedRecords.archivedAt))).limit(1);
  if (!item) throw new Error("Item de estoque não encontrado");
  const nextQuantity = (item.quantity ?? 0) + input.delta;
  if (nextQuantity < 0) throw new Error("A movimentação deixaria o estoque negativo");
  await db.transaction(async (tx) => {
    await tx.update(managedRecords).set({ quantity: nextQuantity, updatedAt: new Date() }).where(eq(managedRecords.id, input.id));
    await tx.insert(inventoryMovements).values({ recordId: input.id, actorUserId: userId, deltaQuantity: input.delta, note: cleanText(input.note, 500) || null });
  });
  await recordAdminAction(userId, "stock_adjustment", "stock", input.id, `Movimentação de estoque: ${input.delta}`);
  return { quantity: nextQuantity };
}

export async function listInventoryMovements(id: number) {
  const db = await requireDb();
  return db.select({ id: inventoryMovements.id, deltaQuantity: inventoryMovements.deltaQuantity,
    note: inventoryMovements.note, createdAt: inventoryMovements.createdAt })
    .from(inventoryMovements).where(eq(inventoryMovements.recordId, id)).orderBy(desc(inventoryMovements.createdAt)).limit(100);
}

async function recordAdminAction(userId: number, action: string, entity: string, entityId: number | null, summary: string) {
  const db = await requireDb();
  await db.insert(adminAudit).values({ actorUserId: userId, action, entity, entityId, summary: summary.slice(0, 300) });
}

export const editableSettingKeys = [...SETTINGS_KEYS];
