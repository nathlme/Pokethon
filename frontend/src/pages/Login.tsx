import React, {useState} from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

type FormData = {
    email: string;
    password: string;
};


export default function Login() {
    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData({...formData, [e.target.name] : e.target.value});
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        console.log(formData);
    }


    return (
        <div>
            <h1>Connexion</h1>
            
            <form onSubmit={handleSubmit}> 
                <label>Email :</label><br />
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} /><br />
                <label>Mot de passe :</label><br />
                <input type="password" name="password" id="password" value={formData.password} onChange={handleChange}/><br />

                <button type="submit">Se connecter</button> 
                {/* <p>Pas encore de compte ? <Link to="/register">S'inscrire ici</Link> </p>  J'ai mis en commentaire le temps d'avoir les routes */}
            </form>
        </div>
    );
}