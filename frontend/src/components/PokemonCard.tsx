import {type Pokemon} from "../types/Pokemon";

type PokemonCardProps = {
    pokemon: Pokemon
}

export default function PokemonCard({pokemon}: PokemonCardProps) {
    return (
        <div className="card flex flex-col items-center text-center">
            <img src={pokemon.sprite_url} alt={pokemon.name} className="h-24 w-24 [image-rendering:pixelated]"/>

            <h2 className="mt-2 text-lg">{pokemon.name}</h2>
            <p>Type : {pokemon.type}</p>

            <p>Pv : {pokemon.hp}</p>
            <p>Attaque : {pokemon.attack}</p>
            <p>Defense : {pokemon.defense}</p>
            <p>Vitesse : {pokemon.speed}</p>

        </div>
    );
}