import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import HolePage from "./pages/HolePage";
import PageNotFound from "./pages/PageNotFound";

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Navigate to={`/new`} replace />} />
                <Route path="/hole/:holeId" element={<HolePage />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </HashRouter>
    );
}

export default App;