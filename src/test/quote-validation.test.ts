import { describe, expect, it } from "vitest";
import { validateStep } from "@/components/site/QuoteForm";

const base = { ambiente: "Cozinha", objetivo: "Cozinha integrada à sala", cidade: "X", medidas: "", prazo: "1 a 3 meses", investimento: "Prefiro não informar", nome: "Ana", telefone: "(11) 99999-0000", email: "ana@ex.com", aceitePrivacidade: true };

describe("quote form", () => {
  it("requires privacy acceptance", () => {
    expect(validateStep(2, { ...base, aceitePrivacidade: false }).aceitePrivacidade).toBeTruthy();
  });
  it("accepts a complete contact step", () => {
    expect(validateStep(2, base)).toEqual({});
  });
  it("requires prazo and investimento on step 2", () => {
    const e = validateStep(1, { ...base, prazo: "", investimento: "" });
    expect(e.prazo && e.investimento).toBeTruthy();
  });
});
