import "./CollectionPage.css";

function CollectionPage() {
  const captures: unknown[] = [];

  return (
    <div className="collection-page">
      <h1>Ma Collection</h1>

      <div className="captures-grid">
        {captures.length === 0 && <p>Aucune capture pour le moment.</p>}
      </div>

      <section className="team-section">
        <h2>Mon Équipe</h2>
        <div className="team-slots">
          {[1, 2, 3, 4, 5, 6].map((position) => (
            <div key={position} className="team-slot">
              Slot {position}
            </div>
          ))}
        </div>
        <button disabled>Génération auto</button>
      </section>
    </div>
  );
}

export default CollectionPage;