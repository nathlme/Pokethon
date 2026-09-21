import { useParams } from "react-router-dom";

function PokemonDetail() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="pokemon-detail">
      <h1>Détail Pokémon #{id}</h1>

      <div className="pokemon-detail__sprite">
        <div className="placeholder-sprite">Sprite</div>
      </div>

      <div className="pokemon-detail__stats">
        <ul>
          <li>HP : --</li>
          <li>Attaque : --</li>
          <li>Défense : --</li>
          <li>Vitesse : --</li>
        </ul>
      </div>

      <div className="pokemon-detail__types">
        {/* TODO: liste des types (badges) */}
      </div>

      <button className="pokemon-detail__capture-btn">Capturer</button>

      {/* Zone réservée pour P4 : édition de note sur la capture */}
      <div className="pokemon-detail__note">
        {/* P4 : intègre ici ton composant NoteEditor */}
      </div>
    </div>
  );
}

export default PokemonDetail;
