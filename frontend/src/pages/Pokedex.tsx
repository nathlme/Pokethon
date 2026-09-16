import PokemonCard from "../components/PokemonCard";
import { type Pokemon } from "../types/Pokemon";
import { useState } from "react";


type SearchData = {
    search: string;
}

export default function Pokedex() {
     const pokemons: Pokemon[] = [
        {
            id: 1,
            name: "Bulbasaur",
            sprite_url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
            hp: 45,
            attack: 49,
            defense: 49,
            speed: 45
        },
        {
            id: 4,
            name: "Charmander",
            sprite_url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
            hp: 39,
            attack: 52,
            defense: 43,
            speed: 65
        }
    ];

    const [searchData, setSearch] = useState<SearchData>({ 
        search: "",}        
    );

    
    let filteredList: Pokemon[] = pokemons.filter((pokemon) => pokemon.name.toLowerCase().includes(searchData.search.toLowerCase()));

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
            setSearch({...searchData, [e.target.name] : e.target.value});
            console.log(searchData)
             
        }

    

    return (
        <div>
            <h1>Pokédex</h1>
            <label>Rechercher un Pokemon </label>
            <input type="text" name="search" value={searchData.search} onChange={handleChange}/>
            {filteredList.map((pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} />
                ))}
        </div>
    )
}