import React, {useState} from "react";


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
                <label>Email :</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} />
                <label>Mot de passe :</label>
                <input type="password" name="password" id="password" value={formData.password} onChange={handleChange}/>

                <button type="submit">Se connecter</button>
            </form>
        </div>
    );
}