export type PokemonType = {
    id: number,
    name: string
}

export type Pokemon = {
    id: number,
    name: string,
    type: string,
    types: PokemonType[],
    sprite_url: string,
    hp: number,
    attack: number,
    defense: number,
    speed: number,
}