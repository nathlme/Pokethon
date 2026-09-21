import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import apiFetch from "../services/api";


type FormData = {
    email: string;
    password: string;
};


export default function Login() {
    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
    });
    const navigate = useNavigate();
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData({...formData, [e.target.name] : e.target.value});
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("")
        setLoading(true);

        try{
        
            const response = await apiFetch("/auth/login", { method: "POST", headers: {"Content-Type" : "application/json"}, body: JSON.stringify(formData)} )
            
            if (!response.ok) {
                setError("Email ou mot de passe incorrect.");
                return 
            }
            const data = await response.json()
            
            localStorage.setItem("token", data.access_token);
            navigate("/pokedex");
        } catch {
            setError("Impossible de contacter le serveur. Réessaie plus tard.");        
        } finally {
            setLoading(false);
        } 
         
    }


    return (
        <div>
            <h1>Connexion</h1>
            
            <form onSubmit={handleSubmit}> 
                <label>Email :</label><br />
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required  /><br />
                <label>Mot de passe :</label><br />
                <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} required /><br />

                {error && <p>{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? "Connexion en cours..." : "Se connecter"}
                </button> 
                {/* <p>Pas encore de compte ? <Link to="/register">S'inscrire ici</Link> </p>  J'ai mis en commentaire le temps d'avoir les routes */}
            </form>
        </div>
    );
}