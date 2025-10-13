import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HolePage from "./pages/HolePage";
import PageNotFound from "./pages/PageNotFound";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to={`/hole/new`} replace />} />
                <Route path="/hole/:holeID" element={<HolePage />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
