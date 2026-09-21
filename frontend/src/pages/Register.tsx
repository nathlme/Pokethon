import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import apiFetch from "../services/api";

type FormData = {
    username : string;
    email: string;
    password: string;
};


export default function Register() {
    const [formData, setFormData] = useState<FormData>({
        username: "",
        email: "",
        password: "",
    });
    
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    

    function isPasswordValid(password: string): string {
        let msg = "";
        const regex = /^(?=.*[A-Z])(?=.*\d).+$/;
        if (password.length < 8) {
            msg = "Le mot de passe doit contenir au moins 8 caractères";
            return msg;
        }

        if (!regex.test(password)) {
            msg = "Le mot de passe doit contenir au moins une majuscule et un chiffre";
            return msg;
        }

        return msg;
    }


    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData({...formData, [e.target.name] : e.target.value});
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
            e.preventDefault();
            const message = isPasswordValid(formData.password)
            if (message != "") {
                setError(message);
                return;
            }
            setError("");
            setLoading(true);

            try {
                const response = await apiFetch("/auth/register", { method: "POST", headers: {"Content-Type" : "application/json"}, body: JSON.stringify(formData)} )
                if (!response.ok) {
                    setError("Inscription refusée. Vérifie tes informations.");
                    return;
                }
                navigate("/login");

            } catch{
                setError("Impossible de contacter le serveur. Réessaie plus tard.")
            } finally {
                setLoading(false);
            }
             
        }

    return (
        <div>
            <h1>Inscription</h1>
            
            <form onSubmit={handleSubmit}>
                <label>Pseudo :</label><br />
                <input type="text" name="username" id="username" value={formData.username} onChange={handleChange} required /><br />
                <label>Email :</label><br />
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required /><br />
                <label>Mot de passe :</label><br />
                <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} required /><br />
                {error && <p>{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Inscription en cours..." : "S'inscrire"}
                </button> 
                {/* <p>Déjà un compte ? <Link to="/login">Se connecter ici</Link></p>  J'ai mis en commentaire le temps d'avoir les routes */}
            </form>
        </div>
    );
}