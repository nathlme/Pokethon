// App.tsx
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Pokedex from "./pages/Pokedex";
import Login from "./pages/Login";
import "../global.css";

function App() {
    return (
        <>
            <Navbar darkMode={darkMode} onToggleTheme={() => setDarkMode(!darkMode)} />
                <Login />
            <main className="page">...</main>
        </>        
    );
}

export default App;