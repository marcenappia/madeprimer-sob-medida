import {
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const quotes = mysqlTable(
  "quotes",
  {
    id: int("id").autoincrement().primaryKey(),
    reference: varchar("reference", { length: 24 }).notNull().unique(),
    projectType: varchar("projectType", { length: 120 }).notNull(),
    objective: varchar("objective", { length: 500 }).notNull(),
    city: varchar("city", { length: 160 }).notNull(),
    measurements: varchar("measurements", { length: 500 }),
    desiredTimeline: varchar("desiredTimeline", { length: 120 }),
    budgetRange: varchar("budgetRange", { length: 120 }),
    message: text("message"),
    fullName: varchar("fullName", { length: 180 }).notNull(),
    phone: varchar("phone", { length: 40 }).notNull(),
    email: varchar("email", { length: 320 }).notNull(),
    privacyAcceptedAt: timestamp("privacyAcceptedAt").notNull(),
    status: mysqlEnum("status", ["new", "contacted", "converted", "lost"]).default("new").notNull(),
    estimatedValueCents: int("estimatedValueCents"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [index("quotes_status_created_idx").on(table.status, table.createdAt)],
);

export const quoteStatusHistory = mysqlTable("quote_status_history", {
  id: int("id").autoincrement().primaryKey(),
  quoteId: int("quoteId").notNull().references(() => quotes.id),
  actorUserId: int("actorUserId").notNull().references(() => users.id),
  fromStatus: varchar("fromStatus", { length: 24 }).notNull(),
  toStatus: varchar("toStatus", { length: 24 }).notNull(),
  note: varchar("note", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const quoteAttachments = mysqlTable(
  "quote_attachments",
  {
    id: int("id").autoincrement().primaryKey(),
    quoteId: int("quoteId").notNull().references(() => quotes.id),
    storageKey: varchar("storageKey", { length: 500 }).notNull().unique(),
    originalName: varchar("originalName", { length: 255 }).notNull(),
    contentType: varchar("contentType", { length: 120 }).notNull(),
    byteSize: int("byteSize").notNull(),
    deletedAt: timestamp("deletedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [index("quote_attachments_quote_idx").on(table.quoteId, table.deletedAt)],
);

export const quoteUploadTickets = mysqlTable(
  "quote_upload_tickets",
  {
    id: int("id").autoincrement().primaryKey(),
    quoteId: int("quoteId").notNull().references(() => quotes.id),
    tokenHash: varchar("tokenHash", { length: 64 }).notNull().unique(),
    uploadCount: int("uploadCount").default(0).notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [index("quote_upload_tickets_expiry_idx").on(table.expiresAt)],
);

export const managedRecords = mysqlTable(
  "managed_records",
  {
    id: int("id").autoincrement().primaryKey(),
    module: mysqlEnum("module", ["projects", "testimonials", "services", "partners", "finance", "team", "stock"]).notNull(),
    title: varchar("title", { length: 180 }).notNull(),
    category: varchar("category", { length: 120 }),
    description: text("description"),
    status: varchar("status", { length: 24 }).default("draft").notNull(),
    amountCents: int("amountCents"),
    direction: varchar("direction", { length: 16 }),
    quantity: int("quantity"),
    minimumQuantity: int("minimumQuantity"),
    unit: varchar("unit", { length: 32 }),
    url: varchar("url", { length: 2048 }),
    sortOrder: int("sortOrder").default(0).notNull(),
    data: json("data").$type<Record<string, string | number | boolean | null>>().notNull(),
    createdBy: int("createdBy").references(() => users.id),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    archivedAt: timestamp("archivedAt"),
  },
  (table) => [
    index("managed_records_module_status_idx").on(table.module, table.status, table.archivedAt),
    index("managed_records_finance_idx").on(table.module, table.direction, table.createdAt),
  ],
);

export const inventoryMovements = mysqlTable("inventory_movements", {
  id: int("id").autoincrement().primaryKey(),
  recordId: int("recordId").notNull().references(() => managedRecords.id),
  actorUserId: int("actorUserId").notNull().references(() => users.id),
  deltaQuantity: int("deltaQuantity").notNull(),
  note: varchar("note", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const siteSettings = mysqlTable("site_settings", {
  id: int("id").autoincrement().primaryKey(),
  settingKey: varchar("settingKey", { length: 80 }).notNull().unique(),
  settingValue: text("settingValue").notNull(),
  updatedBy: int("updatedBy").references(() => users.id),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const adminAudit = mysqlTable(
  "admin_audit",
  {
    id: int("id").autoincrement().primaryKey(),
    actorUserId: int("actorUserId").notNull().references(() => users.id),
    action: varchar("action", { length: 40 }).notNull(),
    entity: varchar("entity", { length: 40 }).notNull(),
    entityId: int("entityId"),
    summary: varchar("summary", { length: 300 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [index("admin_audit_created_idx").on(table.createdAt)],
);
