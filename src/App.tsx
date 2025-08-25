// src/App.tsx
import "@/capacitor/ble-listener"; // <-- make sure BLE notifications are bridged

import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { BluetoothProvider } from "@/hooks/useBluetooth";
import ViewportMeta from "@/setup/ViewportMeta";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* Ensure iOS safe-area insets are reported */}
    <ViewportMeta />

    <BluetoothProvider>
      <TooltipProvider>
        <Sonner
          position="bottom-center"
          closeButton
          richColors
          offset={80}   // keeps toasts above bottom nav
          visibleToasts={3}
        />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </BluetoothProvider>
  </QueryClientProvider>
);

export default App;