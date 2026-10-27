/**
 * Unified type exports
 * Import shared types from this single entry point.
 */

export type * from "../drizzle/schema";
export * from "./_core/errors";

export type RecordModule = "projects" | "testimonials" | "services" | "partners" | "finance" | "team" | "stock";

export type QuoteInput = {
  projectType: string;
  objective: string;
  city: string;
  measurements?: string;
  desiredTimeline?: string;
  budgetRange?: string;
  message?: string;
  fullName: string;
  phone: string;
  email: string;
  privacyAccepted: true;
  attachmentCount: number;
};

export type RecordValues = {
  title: string;
  category: string | null;
  description: string;
  status: string;
  amountCents: number | null;
  direction: string | null;
  quantity: number | null;
  minimumQuantity: number | null;
  unit: string | null;
  url: string | null;
  data: Record<string, string | number | boolean | null>;
};
