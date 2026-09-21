import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PokemonDetail from "./pages/PokemonDetail";
import PrivateRoute from "./components/PrivateRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<PrivateRoute />}>
                    <Route path="/pokedex" element={<div>Pokédex (à venir)</div>} />
                    <Route path="/pokemon/:id" element={<PokemonDetail />} />
                    <Route path="/collection" element={<div>Collection (à venir)</div>} />
                    <Route path="/trades" element={<div>Échanges (à venir)</div>} />
                    <p>azfhauhf</p>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;