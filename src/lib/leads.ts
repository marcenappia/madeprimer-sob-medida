// Lead domain model + repository interface. Prepared for a future leads panel.
// Current implementation is a local demo: nothing leaves the browser.

export type QuoteLead = {
  ambiente: string;
  objetivo: string;
  cidade: string;
  medidas: string;
  prazo: string;
  investimento: string;
  referencias: { name: string; size: number }[];
  nome: string;
  telefone: string;
  email: string;
  aceitePrivacidade: boolean;
};

export interface LeadRepository {
  submit(lead: QuoteLead): Promise<{ id: string }>;
}

export const demoLeadRepository: LeadRepository = {
  async submit() {
    await new Promise((r) => setTimeout(r, 700));
    return { id: `DEMO-${Date.now().toString(36).toUpperCase()}` };
  },
};

// Mandatory label for any future AI-generated visual.
export const AI_VISUAL_DISCLAIMER = "Visualização conceitual — não é projeto executivo.";
