import { useEffect, useMemo, useState, type FormEvent } from "react";

import apiFetch from "../services/api";
import PokemonCard from "../components/PokemonCard";
import { type Pokemon } from "../types/Pokemon";


type Capture = {
    id: number;
    user_id: number;
    pokemon_id: number;
    nickname: string | null;
};

type Trade = {
    id: number;
    from_user_id: number;
    to_user_id: number;
    offered_capture_id: number;
    requested_capture_id: number;
    status: string;
    created_at: string;
};

type CurrentUser = {
    id: number;
    username: string;
    email: string;
};


export default function Trades() {
    const [captures, setCaptures] = useState<Capture[]>([]);
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [trades, setTrades] = useState<Trade[]>([]);
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

    const [offeredCaptureId, setOfferedCaptureId] = useState("");
    const [targetUserId, setTargetUserId] = useState("");
    const [requestedCaptureId, setRequestedCaptureId] = useState("");

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        async function loadPage() {
            await Promise.all([
                loadCaptures(),
                loadPokemons(),
                loadTrades(),
                loadCurrentUser(),
            ]);

            setLoading(false);
        }

        loadPage();
    }, []);


    async function loadCaptures() {
        try {
            const response = await apiFetch("/captures/");

            if (!response.ok) throw new Error();

            setCaptures(await response.json());
        } catch {
            setMessage("Impossible de charger vos Pokémon.");
        }
    }


    async function loadPokemons() {
        try {
            const response = await apiFetch("/pokemons");

            if (!response.ok) throw new Error();

            setPokemons(await response.json());
        } catch {
            setMessage("Impossible de charger les Pokémon.");
        }
    }


    async function loadTrades() {
        try {
            const response = await apiFetch("/trades/me");

            if (!response.ok) throw new Error();

            setTrades(await response.json());
        } catch {
            setMessage("Impossible de charger vos échanges.");
        }
    }


    async function loadCurrentUser() {
        try {
            const response = await apiFetch("/users/me");

            if (!response.ok) throw new Error();

            setCurrentUser(await response.json());
        } catch {
            setMessage("Impossible de récupérer votre profil.");
        }
    }


    function getPokemon(capture: Capture) {
        return pokemons.find(
            pokemon => pokemon.id === capture.pokemon_id
        );
    }


    function getCaptureName(captureId: number) {
        const capture = captures.find(
            item => item.id === captureId
        );

        if (!capture) {
            return `Capture #${captureId}`;
        }

        const pokemon = getPokemon(capture);

        return capture.nickname
            ?? pokemon?.name
            ?? `Capture #${captureId}`;
    }


    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage("");

        if (!offeredCaptureId || !targetUserId || !requestedCaptureId) {
            setMessage("Veuillez remplir tous les champs.");
            return;
        }

        try {
            const response = await apiFetch("/trades/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    to_user_id: Number(targetUserId),
                    offered_capture_id: Number(offeredCaptureId),
                    requested_capture_id: Number(requestedCaptureId),
                }),
            });

            if (!response.ok) {
                const error = await response.json();

                setMessage(
                    error.detail ?? "Impossible de créer l'échange."
                );

                return;
            }

            setMessage("Proposition d'échange envoyée !");
            setOfferedCaptureId("");
            setTargetUserId("");
            setRequestedCaptureId("");

            await loadTrades();

        } catch {
            setMessage("Le service d'échange est indisponible.");
        }
    }


    async function handleTradeAction(
        tradeId: number,
        action: "accept" | "refuse"
    ) {
        try {
            const response = await apiFetch(
                `/trades/${tradeId}/${action}`,
                { method: "PUT" }
            );

            if (!response.ok) {
                const error = await response.json();

                setMessage(
                    error.detail ?? "Impossible de traiter cet échange."
                );

                return;
            }

            setMessage(
                action === "accept"
                    ? "Échange accepté !"
                    : "Échange refusé."
            );

            await loadTrades();

        } catch {
            setMessage("Le service d'échange est indisponible.");
        }
    }


    function getStatusLabel(status: string) {
        if (status === "accepted") return "Accepté";
        if (status === "refused") return "Refusé";

        return "En attente";
    }


    function renderTrade(trade: Trade, received: boolean) {
        return (
            <article
                key={trade.id}
                className="rounded-xl border p-5 shadow-sm"
            >
                <div className="flex items-center justify-between">
                    <h3 className="font-bold">
                        Échange #{trade.id}
                    </h3>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold dark:bg-gray-800">
                        {getStatusLabel(trade.status)}
                    </span>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900">
                        <p className="text-sm opacity-60">
                            Pokémon proposé
                        </p>

                        <p className="font-bold">
                            {getCaptureName(trade.offered_capture_id)}
                        </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900">
                        <p className="text-sm opacity-60">
                            Pokémon demandé
                        </p>

                        <p className="font-bold">
                            {getCaptureName(trade.requested_capture_id)}
                        </p>
                    </div>
                </div>

                <p className="mt-3 text-sm opacity-70">
                    Joueur #{trade.from_user_id}
                    {" → "}
                    Joueur #{trade.to_user_id}
                </p>

                {received && trade.status === "pending" && (
                    <div className="mt-4 flex gap-3">
                        <button
                            type="button"
                            className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white"
                            onClick={() =>
                                handleTradeAction(trade.id, "accept")
                            }
                        >
                            Accepter
                        </button>

                        <button
                            type="button"
                            className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white"
                            onClick={() =>
                                handleTradeAction(trade.id, "refuse")
                            }
                        >
                            Refuser
                        </button>
                    </div>
                )}
            </article>
        );
    }


    const selectedCapture = useMemo(
        () =>
            captures.find(
                capture =>
                    capture.id === Number(offeredCaptureId)
            ),
        [captures, offeredCaptureId]
    );

    const selectedPokemon = selectedCapture
        ? getPokemon(selectedCapture)
        : undefined;

    const receivedTrades = currentUser
        ? trades.filter(
            trade => trade.to_user_id === currentUser.id
        )
        : [];

    const sentTrades = currentUser
        ? trades.filter(
            trade => trade.from_user_id === currentUser.id
        )
        : [];


    if (loading) {
        return (
            <div className="page">
                <p>Chargement du centre d'échange...</p>
            </div>
        );
    }


    return (
        <div className="page">

            <section className="mb-8 rounded-2xl bg-red-600 p-8 text-white shadow-lg">
                <h1 className="text-3xl font-bold">
                    Échanges Pokémon
                </h1>

                <p className="mt-2 opacity-90">
                    Proposez vos Pokémon et complétez votre collection.
                </p>
            </section>


            <section className="card mb-8">
                <h2 className="mb-4 text-2xl font-bold">
                    Choisissez votre Pokémon
                </h2>

                {captures.length === 0 ? (
                    <p>Aucun Pokémon disponible.</p>
                ) : (
                    <div className="card-grid">
                        {captures.map(capture => {
                            const pokemon = getPokemon(capture);

                            if (!pokemon) return null;

                            const selected =
                                String(capture.id) === offeredCaptureId;

                            return (
                                <button
                                    key={capture.id}
                                    type="button"
                                    onClick={() =>
                                        setOfferedCaptureId(
                                            String(capture.id)
                                        )
                                    }
                                    className={
                                        selected
                                            ? "rounded-xl border-4 border-red-600 p-2"
                                            : "rounded-xl border-2 border-transparent p-2"
                                    }
                                >
                                    <PokemonCard pokemon={pokemon} />

                                    {selected && (
                                        <p className="mt-2 font-bold text-red-600">
                                            Sélectionné
                                        </p>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </section>


            <section className="card mb-8">
                <h2 className="mb-4 text-2xl font-bold">
                    Préparer l'échange
                </h2>

                {selectedPokemon && (
                    <div className="mb-5 flex items-center gap-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                        <img
                            src={selectedPokemon.sprite_url}
                            alt={selectedPokemon.name}
                            className="h-20 w-20 [image-rendering:pixelated]"
                        />

                        <div>
                            <p className="text-sm opacity-60">
                                Vous proposez
                            </p>

                            <p className="text-xl font-bold">
                                {selectedCapture?.nickname
                                    ?? selectedPokemon.name}
                            </p>
                        </div>
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                >
                    <input
                        className="field"
                        type="number"
                        min="1"
                        value={targetUserId}
                        onChange={event =>
                            setTargetUserId(event.target.value)
                        }
                        placeholder="Identifiant du joueur"
                    />

                    <input
                        className="field"
                        type="number"
                        min="1"
                        value={requestedCaptureId}
                        onChange={event =>
                            setRequestedCaptureId(event.target.value)
                        }
                        placeholder="Identifiant de la capture demandée"
                    />

                    <button
                        type="submit"
                        className="btn-primary"
                    >
                        Proposer l'échange
                    </button>
                </form>

                {message && (
                    <p className="mt-4 font-semibold">
                        {message}
                    </p>
                )}
            </section>


            <section className="card">
                <h2 className="mb-4 text-2xl font-bold">
                    Échanges reçus
                </h2>

                <div className="flex flex-col gap-4">
                    {receivedTrades.length === 0
                        ? <p>Aucun échange reçu.</p>
                        : receivedTrades.map(
                            trade => renderTrade(trade, true)
                        )}
                </div>

                <h2 className="mb-4 mt-8 text-2xl font-bold">
                    Échanges envoyés
                </h2>

                <div className="flex flex-col gap-4">
                    {sentTrades.length === 0
                        ? <p>Aucun échange envoyé.</p>
                        : sentTrades.map(
                            trade => renderTrade(trade, false)
                        )}
                </div>
            </section>

        </div>
    );
}