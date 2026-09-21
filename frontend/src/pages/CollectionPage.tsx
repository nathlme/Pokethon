import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import "./CollectionPage.css";

interface Capture {
  id: number;
  pokemon_id: number;
  nickname?: string;
}

interface TeamSlotData {
  id: number;
  position: number;
  capture_id: number;
}

function CollectionPage() {
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [slots, setSlots] = useState<TeamSlotData[]>([]);
  const [teamId, setTeamId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const capturesData = await apiFetch("/captures");
        setCaptures(capturesData);

        const teamData = await apiFetch("/teams/me");
        setTeamId(teamData.id);
        setSlots(teamData.slots ?? []);
      } catch (err) {
        setError("Impossible de charger votre collection.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleAddToSlot(captureId: number, position: number) {
    if (!teamId) return;
    try {
      const newSlot = await apiFetch("/team-slots", {
        method: "POST",
        body: JSON.stringify({ team_id: teamId, capture_id: captureId, position }),
      });
      setSlots((prev) => [...prev, newSlot]);
    } catch {
      alert("Impossible d'ajouter cette capture à l'équipe.");
    }
  }

  async function handleAutoGenerate() {
    try {
      const generatedSlots = await apiFetch("/teams/auto-generate", { method: "POST" });
      setSlots(generatedSlots);
    } catch {
      alert("Impossible de générer une équipe automatiquement.");
    }
  }

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="collection-page">
      <h1>Ma Collection</h1>
      <div className="captures-grid">
        {captures.length === 0 && <p>Aucune capture pour le moment.</p>}
        {captures.map((capture) => (
          <div key={capture.id} className="capture-card">
            <span>{capture.nickname || `Pokémon #${capture.pokemon_id}`}</span>
            <select defaultValue="" onChange={(e) => handleAddToSlot(capture.id, Number(e.target.value))}>
              <option value="" disabled>
                Ajouter au slot...
              </option>
              {[1, 2, 3, 4, 5, 6].map((pos) => (
                <option key={pos} value={pos}>
                  Slot {pos}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <section className="team-section">
        <h2>Mon Équipe</h2>
        <div className="team-slots">
          {[1, 2, 3, 4, 5, 6].map((position) => {
            const slot = slots.find((s) => s.position === position);
            return (
              <div key={position} className="team-slot">
                {slot ? `Capture #${slot.capture_id}` : `Slot ${position} (vide)`}
              </div>
            );
          })}
        </div>
        <button onClick={handleAutoGenerate}>Génération auto</button>
      </section>
    </div>
  );
}

export default CollectionPage;