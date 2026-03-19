import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";

import PortfolioLayout from "./components/layout/PortfolioLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import { OwnerProvider } from "./lib/OwnerContext";
import OwnerPage from "./pages/owner/OwnerPage";
import OwnerLayout from "./pages/owner/OwnerLayout";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerProfile from "./pages/owner/OwnerProfile";

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <OwnerProvider>
          <Routes>
            <Route path="/owner" element={<OwnerPage />}>
              <Route element={<OwnerLayout />}>
                <Route index element={<OwnerDashboard />} />
                <Route path="profile" element={<OwnerProfile />} />
              </Route>
            </Route>
            <Route element={<PortfolioLayout />}>
              <Route path="/" element={<Navigate to="/Home" replace />} />
              <Route path="/Home" element={<Home />} />
              <Route path="/About" element={<About />} />
              <Route path="/Projects" element={<Projects />} />
              <Route path="/Contact" element={<Contact />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </OwnerProvider>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
