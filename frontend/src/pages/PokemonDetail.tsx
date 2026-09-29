import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiFetch from "../services/api";
import { type Pokemon } from "../types/Pokemon";

type Capture = {
  id: number;
  pokemon_id: number;
  nickname?: string;
};

function PokemonDetail() {
  const { id } = useParams<{ id: string }>();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [captured, setCaptured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [capturing, setCapturing] = useState(false);
  const [captureError, setCaptureError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const pokemonResponse = await apiFetch(`/pokemons/${id}`);
        if (pokemonResponse.status === 404) {
          throw new Error("Pokémon introuvable");
        }
        if (!pokemonResponse.ok) {
          throw new Error("Impossible de charger ce Pokémon");
        }
        const pokemonData: Pokemon = await pokemonResponse.json();
        setPokemon(pokemonData);

        const capturesResponse = await apiFetch("/captures");
        if (capturesResponse.ok) {
          const captures: Capture[] = await capturesResponse.json();
          setCaptured(captures.some((capture) => capture.pokemon_id === pokemonData.id));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur rencontrée");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  async function handleCapture() {
    if (!pokemon) return;
    setCapturing(true);
    setCaptureError("");
    try {
      const response = await apiFetch("/captures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pokemon_id: pokemon.id }),
      });
      if (!response.ok) {
        throw new Error("La capture a échoué");
      }
      setCaptured(true);
    } catch (err) {
      setCaptureError(err instanceof Error ? err.message : "Erreur rencontrée");
    } finally {
      setCapturing(false);
    }
  }

  if (loading) {
    return <p className="page">Chargement du Pokémon...</p>;
  }
  if (error || !pokemon) {
    return (
      <div className="page">
        <p className="field-error">{error || "Pokémon introuvable"}</p>
      </div>
    );
  }

  return (
    <div className="page pokemon-detail">
      <h1 className="text-display text-pokedex-red mb-8">
        #{pokemon.id} {pokemon.name}
      </h1>

      <div className="card flex flex-col items-center text-center">
        <div className="pokemon-detail__sprite">
          <img
            src={pokemon.sprite_url}
            alt={pokemon.name}
            className="h-40 w-40 [image-rendering:pixelated]"
          />
        </div>

        <div className="pokemon-detail__types">
          <p>Type : {pokemon.type}</p>
        </div>

        <div className="pokemon-detail__stats">
          <ul>
            <li>HP : {pokemon.hp}</li>
            <li>Attaque : {pokemon.attack}</li>
            <li>Défense : {pokemon.defense}</li>
            <li>Vitesse : {pokemon.speed}</li>
          </ul>
        </div>

        <button
          className="btn-primary pokemon-detail__capture-btn mt-4"
          onClick={handleCapture}
          disabled={captured || capturing}
        >
          {captured ? "Déjà capturé" : capturing ? "Capture..." : "Capturer"}
        </button>
        {captureError && <p className="field-error">{captureError}</p>}
      </div>

      {/* Zone réservée pour P4 : édition de note sur la capture */}
      <div className="pokemon-detail__note">
        {/* P4 : intègre ici ton composant NoteEditor */}
      </div>
    </div>
  );
}

export default PokemonDetail;
