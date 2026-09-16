import {type Pokemon} from "../types/Pokemon";

type PokemonCardProps = {
    pokemon: Pokemon
}

export default function PokemonCard({pokemon}: PokemonCardProps) {
    return (
        <div>
            <img src={pokemon.sprite_url} alt={pokemon.name} />

            <h2>{pokemon.name}</h2>
            <p>Type : {pokemon.type}</p>

            <p>PV : {pokemon.hp}</p>
            <p>Attaque : {pokemon.attack}</p>
            <p>Defense : {pokemon.defense}</p>
            <p>Vitesse : {pokemon.speed}</p>

        </div>
    );
}