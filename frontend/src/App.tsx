// App.tsx
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Pokedex from "./pages/Pokedex";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PokemonDetail from "./pages/PokemonDetail";
import PrivateRoute from "./components/PrivateRoute";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
    const [darkMode, setDarkMode] = useState(
        () => localStorage.getItem("theme") === "dark"
    );

    useEffect(() => {
        document.documentElement.classList.toggle("dark", darkMode);
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    return (
        <>
            <Navbar darkMode={darkMode} onToggleTheme={() => setDarkMode(!darkMode)} />
                <Pokedex />
            <main className="page"> 
                <Routes>

                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route element={<PrivateRoute />}>
                        <Route path="/pokedex" element={<div>Pokédex (à venir)</div>} />
                        <Route path="/pokemon/:id" element={<PokemonDetail />} />
                        <Route path="/collection" element={<div>Collection (à venir)</div>} />
                        <Route path="/trades" element={<div>Échanges (à venir)</div>} />
                    </Route>
                </Routes>
            </main>
        </> 
    );
}

export default App;