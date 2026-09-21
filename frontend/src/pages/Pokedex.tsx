import PokemonCard from "../components/PokemonCard";
import { type Pokemon } from "../types/Pokemon";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

type SearchData = {
    search: string;
}

export default function Pokedex() {
    const [error, setError] = useState<string>("");

    // useEffect(() => {
    //     fetch("/api/pokemons")
    //         .then((response) => {
    //             if (!response.ok) {
    //                 throw new Error("Erreur rencontrée");
    //             }
    //             return response.json();
    //         })
    //         .then((data) => {
    //             setPokemons(data);
    //         })
    //         .catch((error) => {
    //             setError(error.message)
    //         })
    // }, []);
    
    // if (error) {
    //     return <div>Error : {error} </div>
    // }

    const initialPokemons: Pokemon[] = [
        {
            id: 1,
            name: "Bulbasaur",
            type: "Plante",
            sprite_url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
            hp: 45,
            attack: 49,
            defense: 49,
            speed: 45
        },
        {
            id: 4,
            name: "Charmander",
            type: "Feu",
            sprite_url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
            hp: 39,
            attack: 52,
            defense: 43,
            speed: 65
        }
    ];

    const [searchData, setSearch] = useState<SearchData>({ 
        search: "",
    });
    const [selectedType, setSelectedType] = useState<string>("Tous");
    const [pokemons, setPokemons] = useState<Pokemon[]>(initialPokemons);
   let filteredList: Pokemon[] = pokemons.filter((pokemon) => pokemon.name.toLowerCase().includes(searchData.search.toLowerCase()) && (pokemon.type === selectedType || selectedType === "Tous"));

     
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSearch({...searchData, [e.target.name] : e.target.value});             
    }


    return (
        <div className="page">

        <h1 className="text-display text-pokedex-red mb-8">
            Pokédex
        </h1>

        <div className="card mb-8">
            
            <div className="mb-4">
                <label className="field-label" htmlFor="search">
                    Rechercher un Pokémon
                </label>

                <input
                    className="field"
                    type="text"
                    id="search"
                    name="search"
                    value={searchData.search}
                    onChange={handleChange}
                    placeholder="Nom du Pokémon..."
            />
        </div>

        <div>
            <label className="field-label" htmlFor="type">Filtres Par type</label>
            
            <select 
                className="field"
                name="type" 
                id="type" 
                onChange={(e) => setSelectedType(e.target.value)}
            >
                
                <option value="Tous">Tous</option>
                <option value="Feu">Feu</option>
                <option value="Eau">Eau</option>
                <option value="Plante">Plante</option>
                <option value="Foudre">Foudre</option>
                <option value="Combat">Combat</option>
                <option value="Normal">Normal</option>
                <option value="Feu">Feu</option>
                <option value="Eau">Eau</option>
                <option value="Foudre">Foudre</option>
                <option value="Plante">Plante</option>
                <option value="Glace">Glace</option>
                <option value="Combat">Combat</option>
                <option value="Poison">Poison</option>
                <option value="Sol">Sol</option>
                <option value="Vol">Vol</option>
                <option value="Psy">Psy</option>
                <option value="Insecte">Insecte</option>
                <option value="Roche">Roche</option>
                <option value="Spectre">Spectre</option>
                <option value="Dragon">Dragon</option>
                <option value="Ténèbres">Ténèbres</option>
                <option value="Acier">Acier</option>
                <option value="Fée">Fée</option>
            </select>
         </div>

        </div>

        <div className="card-grid">
            {filteredList.map((pokemon) => (
                <PokemonCard
                    key={pokemon.id}
                    pokemon={pokemon}
                />
            ))}
        </div>

    </div>
)
}