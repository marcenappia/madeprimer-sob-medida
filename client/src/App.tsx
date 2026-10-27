import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { ReactNode } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SiteLayout } from "./components/site/SiteLayout";
import Home from "./pages/Home";
import AdminPage, { AdminModulePage } from "./pages/Admin";
import {
  AboutPage,
  ArchitectsPage,
  ContactPage,
  CorporatePage,
  MyAccountPage,
  PartnersPage,
  PortfolioPage,
  PrivacyPage,
  ProcessPage,
  ResidentialPage,
} from "./pages/MarketingPages";
import QuotePage from "./pages/Quote";
import NotFound from "./pages/NotFound";

function PublicRoute({ children }: { children: ReactNode }) {
  return <SiteLayout>{children}</SiteLayout>;
}

function Router() {
  return <Switch>
    <Route path="/" component={Home} />
    <Route path="/projetos" component={() => <PublicRoute><PortfolioPage /></PublicRoute>} />
    <Route path="/portfolio" component={() => <PublicRoute><PortfolioPage /></PublicRoute>} />
    <Route path="/residencial" component={() => <PublicRoute><ResidentialPage /></PublicRoute>} />
    <Route path="/ambientes-residenciais" component={() => <PublicRoute><ResidentialPage /></PublicRoute>} />
    <Route path="/casa" component={() => <PublicRoute><ResidentialPage /></PublicRoute>} />
    <Route path="/corporativo" component={() => <PublicRoute><CorporatePage /></PublicRoute>} />
    <Route path="/ambientes-corporativos" component={() => <PublicRoute><CorporatePage /></PublicRoute>} />
    <Route path="/business" component={() => <PublicRoute><CorporatePage /></PublicRoute>} />
    <Route path="/arquitetos" component={() => <PublicRoute><ArchitectsPage /></PublicRoute>} />
    <Route path="/processo" component={() => <PublicRoute><ProcessPage /></PublicRoute>} />
    <Route path="/parceiros" component={() => <PublicRoute><PartnersPage /></PublicRoute>} />
    <Route path="/sobre" component={() => <PublicRoute><AboutPage /></PublicRoute>} />
    <Route path="/contato" component={() => <PublicRoute><ContactPage /></PublicRoute>} />
    <Route path="/meus-orcamentos" component={() => <PublicRoute><MyAccountPage /></PublicRoute>} />
    <Route path="/minha-conta" component={() => <PublicRoute><MyAccountPage /></PublicRoute>} />
    <Route path="/orcamento" component={() => <PublicRoute><QuotePage /></PublicRoute>} />
    <Route path="/privacidade" component={() => <PublicRoute><PrivacyPage /></PublicRoute>} />
    <Route path="/admin" component={AdminPage} />
    <Route path="/admin/:section" component={AdminModulePage} />
    <Route path="/404" component={NotFound} />
    <Route component={NotFound} />
  </Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="dark"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
