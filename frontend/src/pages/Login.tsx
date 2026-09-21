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
            <h1 className="text-display text-pokedex-red mb-6 text-center">Connexion</h1>
            
            <form className="card mx-auto max-w-md p-8" onSubmit={handleSubmit}> 
                <label className="field-label">Email :</label><br />
                <input className="field" type="email" name="email" id="email" value={formData.email} onChange={handleChange} required  /><br />
                <label className="field-label">Mot de passe :</label><br />
                <input className="field" type="password" name="password" id="password" value={formData.password} onChange={handleChange} required /><br />

                {error && <p className="field-message mb-4">{error}</p>}
                <button className="btn-primary w-full" type="submit" disabled={loading}>
                    {loading ? "Connexion en cours..." : "Se connecter"}
                </button> 
                {/* <p>Pas encore de compte ? <Link to="/register">S'inscrire ici</Link> </p>  J'ai mis en commentaire le temps d'avoir les routes */}
            </form>
        </div>
    );
}