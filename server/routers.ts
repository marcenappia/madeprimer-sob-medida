import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { hasAdminAccess } from "./access";
import { adjustStock, createQuote, getAdminOverview, getAttachmentDownloadUrl, getPublicSettings, getReportData, listAdminRecords, listInventoryMovements, listPublicRecords, listQuotes, listSettings, saveAdminRecord, saveSiteSetting, archiveAdminRecord, updateQuoteStatus } from "./data";

const modules = ["projects", "testimonials", "services", "partners", "finance", "team", "stock"] as const;
const moduleSchema = z.enum(modules);
const quoteInput = z.object({
  projectType: z.string().trim().min(2).max(120),
  objective: z.string().trim().min(2).max(500),
  city: z.string().trim().min(2).max(160),
  measurements: z.string().max(500).optional().default(""),
  desiredTimeline: z.string().max(120).optional().default(""),
  budgetRange: z.string().max(120).optional().default(""),
  message: z.string().max(4000).optional().default(""),
  fullName: z.string().trim().min(2).max(180),
  phone: z.string().trim().regex(/^[+\d().\s-]{8,40}$/),
  email: z.string().trim().email().max(320),
  privacyAccepted: z.literal(true),
  attachmentCount: z.number().int().min(0).max(6),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(({ ctx }) => hasAdminAccess(ctx.user) ? ctx.user : null),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  site: router({
    publicSettings: publicProcedure.query(() => getPublicSettings()),
    projects: publicProcedure.query(() => listPublicRecords("projects")),
    partners: publicProcedure.query(() => listPublicRecords("partners")),
    submitQuote: publicProcedure.input(quoteInput).mutation(({ input }) => createQuote(input)),
  }),
  admin: router({
    overview: adminProcedure.query(() => getAdminOverview()),
    listRecords: adminProcedure.input(z.object({ module: moduleSchema })).query(({ input }) => listAdminRecords(input.module)),
    createRecord: adminProcedure.input(z.object({ module: moduleSchema, data: z.record(z.string(), z.unknown()) }))
      .mutation(({ input, ctx }) => saveAdminRecord(input.module, input.data, ctx.user.id)),
    updateRecord: adminProcedure.input(z.object({ id: z.number().int().positive(), module: moduleSchema, data: z.record(z.string(), z.unknown()) }))
      .mutation(({ input, ctx }) => saveAdminRecord(input.module, input.data, ctx.user.id, input.id)),
    archiveRecord: adminProcedure.input(z.object({ id: z.number().int().positive() }))
      .mutation(({ input, ctx }) => archiveAdminRecord(input.id, ctx.user.id)),
    listQuotes: adminProcedure.query(() => listQuotes()),
    updateQuoteStatus: adminProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["new", "contacted", "converted", "lost"]), valueCents: z.number().int().nonnegative().max(2_000_000_000).nullable().optional(), note: z.string().max(500).optional() }))
      .mutation(({ input, ctx }) => updateQuoteStatus(input, ctx.user.id)),
    attachmentDownload: adminProcedure.input(z.object({ id: z.number().int().positive() }))
      .mutation(({ input }) => getAttachmentDownloadUrl(input.id)),
    settings: adminProcedure.query(() => listSettings()),
    saveSetting: adminProcedure.input(z.object({ key: z.string().max(80), value: z.string().max(500), })).mutation(({ input, ctx }) => saveSiteSetting(input.key, input.value, ctx.user.id)),
    reportData: adminProcedure.query(() => getReportData()),
    adjustStock: adminProcedure.input(z.object({ id: z.number().int().positive(), delta: z.number().int().min(-1_000_000).max(1_000_000), note: z.string().max(500).optional() }))
      .mutation(({ input, ctx }) => adjustStock(input, ctx.user.id)),
    inventoryMovements: adminProcedure.input(z.object({ id: z.number().int().positive() })).query(({ input }) => listInventoryMovements(input.id)),
  }),
});

export type AppRouter = typeof appRouter;
