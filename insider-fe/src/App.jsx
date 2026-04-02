import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute, AdminProtectedRoute } from "./auth";
import Layout from "./layout/layout";
import { useAuthStore } from "./stores/authStore";

// lazy s
const CoverageIsp = lazy(() => import("./PowerBI/CoverageISP"));
const OdpNasional = lazy(() => import("./PowerBI/OdpNasional"));
const IspProfiling = lazy(() => import("./PowerBI/IspProfiling"));
const ListIsp = lazy(() => import("./ListIsp"));
const ManageUsers = lazy(() => import("./ManageUsers"));
const ManageWhitelists = lazy(() => import("./ManageWhitelists"));
const UsersLogs = lazy(() => import("./UsersLogs"));
const ProfilingFunnelDescription = lazy(() => import("./ProfilingFunnelDescription"));
const About = lazy(() => import("./AboutUs.jsx"));
const FrequentAskedQuestions = lazy(() => import("./FrequentAskedQuestions"));
const MarketDescription = lazy(() => import("./MarketDescription"));
const HomeId = lazy(() => import("./PowerBI/HomeId"));
const Insight = lazy(() => import("./Insight"));
const NotFound = lazy(() => import("./NotFound"));

import { Login } from "./Login";

function App() {
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    initAuth();
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<div className="loading-screen">Loading...</div>}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<CoverageIsp />} />
              <Route path="/list-isp" element={<ListIsp />} />
              <Route path="/odp-nasional" element={<OdpNasional />} />
              <Route path="/isp-profiling" element={<IspProfiling />} />
              <Route path="/home-id" element={<HomeId />} />
              <Route path="/insight" element={<Insight />} />
              <Route path="/market-landscape-description" element={<MarketDescription />} />

              <Route path="/profiling-funnel-description" element={<ProfilingFunnelDescription />} />
              <Route path="/frequent-asked-questions" element={<FrequentAskedQuestions />} />
              <Route path="/about-us" element={<About />} />

              <Route element={<AdminProtectedRoute />}>
                <Route path="/manage-users" element={<ManageUsers />} />
                <Route path="/manage-whitelists" element={<ManageWhitelists />} />
                <Route path="/users-logs" element={<UsersLogs />} />
              </Route>
            </Route>
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;