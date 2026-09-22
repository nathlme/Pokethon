import { } from "react";
import pokeball from "../assets/pokeball.png";
import hyperball from "../assets/hyperball.png";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
    darkMode: boolean;
    onToggleTheme: () => void;
}

function Navbar({ darkMode, onToggleTheme }: NavbarProps) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav
            className="
                bg-red-600 dark:bg-black
                text-white
                border-b-4 border-red-800 dark:border-yellow-400
                px-6 py-4
            "
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between">

                <h1 className="text-2xl font-bold">
                    PokéDex & Collection
                </h1>

                <div className="flex items-center gap-6">
                    <a href="/login" className="transition hover:text-yellow-300">Connexion</a>
                    <a href="/pokedex" className="transition hover:text-yellow-300">Pokédex</a>
                    <a href="/collection" className="transition hover:text-yellow-300">Ma Collection</a>
                    <a href="/trades" className="transition hover:text-yellow-300">Échanges</a>
                    <button type="button" onClick={handleLogout}>
                        Déconnexion
                    </button>
                    <button
                        onClick={onToggleTheme}
                        className="
                            rounded-full
                            border-2 border-white dark:border-yellow-400
                            p-1
                            transition
                            hover:bg-white
                            dark:hover:bg-yellow-400
                        "
                    >
                        <img
                            src={darkMode ? hyperball : pokeball}
                            alt={darkMode ? "Mode clair" : "Mode sombre"}
                            className="h-8 w-8"
                        />
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;