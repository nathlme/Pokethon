// App.tsx
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
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
            <main className="page">...</main>
        </>        
    );
}

export default App;