import { useEffect, useState } from "react";
import apiFetch from "../services/api";

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
        const capturesResponse = await apiFetch("/captures");

        if (!capturesResponse.ok) {
          throw new Error(`Erreur captures : ${capturesResponse.status}`);
        }

        const capturesData = await capturesResponse.json();

        if (!Array.isArray(capturesData)) {
          throw new Error("La réponse /captures n'est pas une liste.");
        }

        setCaptures(capturesData);

        const teamResponse = await apiFetch("/teams/me");

        if (!teamResponse.ok) {
          throw new Error(`Erreur équipe : ${teamResponse.status}`);
        }
        const teamData = await teamResponse.json();
        setTeamId(teamData.id);
        setSlots(teamData.slots ?? []);
      } catch {
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
      const response = await apiFetch("/team-slots", {
      method: "POST",
        body: JSON.stringify({ team_id: teamId, capture_id: captureId, position }),
        });
      const newSlot = await response.json();
      setSlots((prev) => [...prev, newSlot]);
    } catch {
      alert("Impossible d'ajouter cette capture à l'équipe.");
    }
  }

  async function handleAutoGenerate() {
    try {
      const response = await apiFetch("/teams/auto-generate", { method: "POST" });
      const generatedSlots = await response.json();
        setSlots(generatedSlots);
    } catch {
      alert("Impossible de générer une équipe automatiquement.");
    }
  }

  if (loading) return <p className="page">Chargement...</p>;
  if (error) return <p className="page text-pokedex-red">{error}</p>;

  return (
    <div className="page">
      <h1 className="text-display mb-6">Ma Collection</h1>

      <div className="card-grid mb-10">
        {captures.length === 0 && (
          <p className="text-black/60 dark:text-white/60">Aucune capture pour le moment.</p>
        )}
        {captures.map((capture) => (
          <div key={capture.id} className="card flex flex-col gap-2">
            <span className="font-semibold">
              {capture.nickname || `Pokémon #${capture.pokemon_id}`}
            </span>
            <select
              className="field"
              defaultValue=""
              onChange={(e) => handleAddToSlot(capture.id, Number(e.target.value))}
            >
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

      <section>
        <h2 className="mb-3">Mon Équipe</h2>
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((position) => {
            const slot = slots.find((s) => s.position === position);
            return (
              <div
                key={position}
                className="card flex items-center justify-center text-center text-sm text-black/60 dark:text-white/60"
              >
                {slot ? `Capture #${slot.capture_id}` : `Slot ${position} (vide)`}
              </div>
            );
          })}
        </div>
        <button className="btn-primary" onClick={handleAutoGenerate}>
          Génération auto
        </button>
      </section>
    </div>
  );
}

export default CollectionPage;