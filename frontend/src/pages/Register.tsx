import React, {useState} from "react";


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

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData({...formData, [e.target.name] : e.target.value});
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
            e.preventDefault();
    
            console.log(formData);
        }

    return (
        <div>
            <h1>Inscription</h1>
            
            <form onSubmit={handleSubmit}>
                <label>Pseudo :</label>
                <input type="text" name="pseudo" id="pseudo" value={formData.username} onChange={handleChange} />
                <label>Email :</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} />
                <label>Mot de passe :</label>
                <input type="password" name="password" id="password" value={formData.password} onChange={handleChange}/>

                <button type="submit">S'inscrire</button>
            </form>
        </div>
    );
}