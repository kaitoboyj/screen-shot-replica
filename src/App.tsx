import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { PrivyProvider } from "@/providers/PrivyProvider";
import { SolanaWalletProvider } from "@/providers/SolanaWalletProvider";
import ContractInput from "./pages/ContractInput";
import Index from "./pages/Index";
import Loading from "./pages/Loading";
import Payment from "./pages/Payment";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PrivyProvider>
      <SolanaWalletProvider>
        <ProjectProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<ContractInput />} />
                <Route path="/boost" element={<Index />} />
                <Route path="/loading" element={<Loading />} />
                <Route path="/payment" element={<Payment />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ProjectProvider>
      </SolanaWalletProvider>
    </PrivyProvider>
  </QueryClientProvider>
);

export default App;
