import PokemonCard from "../components/PokemonCard";
import { type Pokemon } from "../types/Pokemon";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import apiFetch from "../services/api";

type SearchData = {
    search: string;
}

export default function Pokedex() {
    const [error, setError] = useState<string>("");
    const [searchData, setSearch] = useState<SearchData>({ 
        search: "",
    });
    const [selectedType, setSelectedType] = useState<string>("Tous");
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        apiFetch("/pokemons")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erreur rencontrée");
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                setPokemons(data);
            })
            .catch((error) => {
                setError(error.message)
            })
            .finally(() => {setLoading(false);})
    }, []);
    
    if (loading) {
        return <p>Chargement des Pokémon...</p>;
    }
    if (error) {
        return <div>Error : {error} </div>
    }

   let filteredList: Pokemon[] = pokemons.filter((pokemon) => pokemon.name.toLowerCase().includes(searchData.search.toLowerCase()) && (pokemon.type === selectedType || selectedType === "Tous"));

     
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSearch({...searchData, [e.target.name] : e.target.value});             
    }


    return (
        <div>
            <h1>Pokédex</h1>
            <label>Rechercher un Pokemon </label>
            <input type="text" name="search" value={searchData.search} onChange={handleChange}/>
            
            <select name="type" id="type" onChange={(e) => setSelectedType(e.target.value)}>
                <option value="Tous">Tous</option>
                <option value="Feu">Feu</option>
                <option value="Eau">Eau</option>
                <option value="Plante">Plante</option>
                <option value="Foudre">Foudre</option>
                <option value="Combat">Combat</option>
            </select>
            {filteredList.length === 0 ? (
                <p>Aucun Pokémon trouvé</p>
            ) : (
                filteredList.map((pokemon) => (
                    <PokemonCard key={pokemon.id} pokemon={pokemon} />
                ))
            )}
        </div>
    )
}