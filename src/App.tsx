import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import CompetitionPage from "@/pages/competition/[competitionId].tsx";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<CompetitionPage />} path="/competition/:competitionId" />
    </Routes>
  );
}

export default App;
