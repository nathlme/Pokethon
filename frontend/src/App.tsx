// App.tsx
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Login from "./pages/Login";

function App() {
    return (
        <>
            <Navbar darkMode={darkMode} onToggleTheme={() => setDarkMode(!darkMode)} />
            <main className="page">...</main>
        </>        
    );
}

export default App;