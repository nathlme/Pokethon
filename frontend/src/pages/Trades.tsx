import {
    useEffect,
    useMemo,
    useState,
    type FormEvent,
} from "react";

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


export default function Trades() {
    const [captures, setCaptures] = useState<Capture[]>([]);
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [trades, setTrades] = useState<Trade[]>([]);

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
            ]);

            setLoading(false);
        }

        loadPage();
    }, []);


    async function loadCaptures() {
        try {
            const response = await apiFetch("/captures/");

            if (!response.ok) {
                throw new Error();
            }

            const data: Capture[] = await response.json();

            setCaptures(data);
        } catch {
            setMessage(
                "Impossible de charger vos Pokémon."
            );
        }
    }


    async function loadPokemons() {
        try {
            const response = await apiFetch("/pokemons");

            if (!response.ok) {
                throw new Error();
            }

            const data: Pokemon[] = await response.json();

            setPokemons(data);
        } catch {
            setMessage(
                "Impossible de charger les informations des Pokémon."
            );
        }
    }


    async function loadTrades() {
        try {
            const response = await apiFetch("/trades/me");

            if (!response.ok) {
                return;
            }

            const data: Trade[] = await response.json();

            setTrades(data);
        } catch {
            // Le backend Trade peut ne pas encore être disponible.
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

        if (!pokemon) {
            return `Capture #${captureId}`;
        }

        return capture.nickname ?? pokemon.name;
    }


    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setMessage("");

        if (
            !offeredCaptureId ||
            !targetUserId ||
            !requestedCaptureId
        ) {
            setMessage(
                "Veuillez remplir tous les champs avant de proposer un échange."
            );

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
                    offered_capture_id: Number(
                        offeredCaptureId
                    ),
                    requested_capture_id: Number(
                        requestedCaptureId
                    ),
                }),
            });

            if (!response.ok) {
                const error = await response.json();

                setMessage(
                    error.detail ??
                    "Impossible de créer cet échange."
                );

                return;
            }

            setMessage(
                "La proposition d'échange a bien été envoyée !"
            );

            setOfferedCaptureId("");
            setTargetUserId("");
            setRequestedCaptureId("");

            await loadTrades();
        } catch {
            setMessage(
                "Le service d'échange est actuellement indisponible."
            );
        }
    }


    async function handleTradeAction(
        tradeId: number,
        action: "accept" | "refuse"
    ) {
        try {
            const response = await apiFetch(
                `/trades/${tradeId}/${action}`,
                {
                    method: "PUT",
                }
            );

            if (!response.ok) {
                const error = await response.json();

                setMessage(
                    error.detail ??
                    "Impossible de traiter cet échange."
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
            setMessage(
                "Le service d'échange est actuellement indisponible."
            );
        }
    }


    function getStatusLabel(status: string) {
        switch (status) {
            case "accepted":
                return "Accepté";

            case "refused":
                return "Refusé";

            default:
                return "En attente";
        }
    }


    function getStatusStyle(status: string) {
        switch (status) {
            case "accepted":
                return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200";

            case "refused":
                return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200";

            default:
                return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200";
        }
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


    const pendingTradeCount = trades.filter(
        trade => trade.status === "pending"
    ).length;


    if (loading) {
        return (
            <div className="page">
                <div className="card text-center">
                    <p className="text-lg font-semibold">
                        Chargement du centre d'échange...
                    </p>

                    <p className="mt-2 opacity-70">
                        Préparation de vos Pokémon.
                    </p>
                </div>
            </div>
        );
    }


    return (
        <div className="page">

            {/* Header */}

            <section
                className="
                    mb-8
                    overflow-hidden
                    rounded-2xl
                    bg-gradient-to-r
                    from-red-600
                    to-red-800
                    p-8
                    text-white
                    shadow-lg
                "
            >
                <div
                    className="
                        flex
                        flex-col
                        gap-5
                        md:flex-row
                        md:items-center
                        md:justify-between
                    "
                >
                    <div>
                        <p
                            className="
                                mb-2
                                text-sm
                                font-bold
                                uppercase
                                tracking-widest
                                text-red-100
                            "
                        >
                            Centre d'échange
                        </p>

                        <h1
                            className="
                                text-3xl
                                font-bold
                                md:text-4xl
                            "
                        >
                            Échanges Pokémon
                        </h1>

                        <p
                            className="
                                mt-3
                                max-w-2xl
                                text-red-100
                            "
                        >
                            Proposez vos Pokémon,
                            découvrez de nouvelles
                            captures et complétez votre
                            collection.
                        </p>
                    </div>

                    <div className="text-6xl">
                        ◉
                    </div>
                </div>
            </section>


            {/* Stats */}

            <section
                className="
                    mb-8
                    grid
                    gap-4
                    sm:grid-cols-3
                "
            >
                <div className="card text-center">
                    <p
                        className="
                            text-3xl
                            font-bold
                            text-red-600
                        "
                    >
                        {captures.length}
                    </p>

                    <p className="mt-1 font-semibold">
                        Pokémon disponibles
                    </p>
                </div>

                <div className="card text-center">
                    <p
                        className="
                            text-3xl
                            font-bold
                            text-red-600
                        "
                    >
                        {trades.length}
                    </p>

                    <p className="mt-1 font-semibold">
                        Échanges
                    </p>
                </div>

                <div className="card text-center">
                    <p
                        className="
                            text-3xl
                            font-bold
                            text-yellow-500
                        "
                    >
                        {pendingTradeCount}
                    </p>

                    <p className="mt-1 font-semibold">
                        En attente
                    </p>
                </div>
            </section>


            {/* Pokémon selection */}

            <section className="card mb-8">

                <div className="mb-6">

                    <p
                        className="
                            text-sm
                            font-bold
                            uppercase
                            tracking-wide
                            text-red-600
                        "
                    >
                        Étape 1
                    </p>

                    <h2
                        className="
                            mt-1
                            text-2xl
                            font-bold
                        "
                    >
                        Choisissez votre Pokémon
                    </h2>

                    <p className="mt-2 opacity-70">
                        Sélectionnez le Pokémon que vous
                        souhaitez proposer.
                    </p>

                </div>


                {captures.length === 0 ? (

                    <div
                        className="
                            rounded-xl
                            border-2
                            border-dashed
                            p-8
                            text-center
                        "
                    >
                        <p className="text-xl font-bold">
                            Aucun Pokémon disponible
                        </p>

                        <p className="mt-2 opacity-70">
                            Capturez d'abord un Pokémon
                            avant de proposer un échange.
                        </p>
                    </div>

                ) : (

                    <div className="card-grid">

                        {captures.map(capture => {

                            const pokemon =
                                getPokemon(capture);

                            if (!pokemon) {
                                return null;
                            }

                            const selected =
                                offeredCaptureId ===
                                String(capture.id);

                            return (

                                <button
                                    key={capture.id}
                                    type="button"
                                    onClick={() =>
                                        setOfferedCaptureId(
                                            String(
                                                capture.id
                                            )
                                        )
                                    }
                                    className={
                                        `
                                        relative
                                        rounded-2xl
                                        p-2
                                        text-left
                                        transition
                                        duration-200
                                        hover:-translate-y-1
                                        hover:shadow-lg
                                        ${
                                            selected
                                                ? "border-4 border-red-600 bg-red-50 shadow-lg dark:bg-red-950"
                                                : "border-2 border-transparent"
                                        }
                                        `
                                    }
                                >

                                    {selected && (
                                        <span
                                            className="
                                                absolute
                                                right-3
                                                top-3
                                                z-10
                                                rounded-full
                                                bg-red-600
                                                px-3
                                                py-1
                                                text-xs
                                                font-bold
                                                text-white
                                            "
                                        >
                                            Sélectionné
                                        </span>
                                    )}


                                    <PokemonCard
                                        pokemon={pokemon}
                                    />


                                    {capture.nickname && (
                                        <div
                                            className="
                                                mt-3
                                                text-center
                                            "
                                        >
                                            <p
                                                className="
                                                    text-xs
                                                    uppercase
                                                    opacity-60
                                                "
                                            >
                                                Surnom
                                            </p>

                                            <p className="font-bold">
                                                {
                                                    capture.nickname
                                                }
                                            </p>
                                        </div>
                                    )}

                                </button>
                            );
                        })}

                    </div>
                )}

            </section>


            {/* Trade form */}

            <section className="card mb-8">

                <div className="mb-6">

                    <p
                        className="
                            text-sm
                            font-bold
                            uppercase
                            tracking-wide
                            text-red-600
                        "
                    >
                        Étape 2
                    </p>

                    <h2
                        className="
                            mt-1
                            text-2xl
                            font-bold
                        "
                    >
                        Préparer l'échange
                    </h2>

                    <p className="mt-2 opacity-70">
                        Indiquez le joueur et la capture
                        que vous souhaitez recevoir.
                    </p>

                </div>


                {selectedPokemon && (

                    <div
                        className="
                            mb-6
                            flex
                            items-center
                            gap-4
                            rounded-xl
                            border
                            bg-gray-50
                            p-4
                            dark:bg-gray-900
                        "
                    >
                        <img
                            src={
                                selectedPokemon.sprite_url
                            }
                            alt={selectedPokemon.name}
                            className="
                                h-20
                                w-20
                                [image-rendering:pixelated]
                            "
                        />

                        <div>

                            <p
                                className="
                                    text-sm
                                    font-semibold
                                    opacity-60
                                "
                            >
                                Vous proposez
                            </p>

                            <p
                                className="
                                    text-xl
                                    font-bold
                                "
                            >
                                {selectedCapture?.nickname ??
                                    selectedPokemon.name}
                            </p>

                            <p className="text-sm opacity-70">
                                {
                                    selectedPokemon.type
                                }
                            </p>

                        </div>
                    </div>
                )}


                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5"
                >

                    <div>
                        <label
                            className="field-label"
                            htmlFor="target-user"
                        >
                            Joueur destinataire
                        </label>

                        <input
                            className="field"
                            id="target-user"
                            type="number"
                            min="1"
                            value={targetUserId}
                            onChange={event =>
                                setTargetUserId(
                                    event.target.value
                                )
                            }
                            placeholder="Identifiant du joueur"
                        />
                    </div>


                    <div>
                        <label
                            className="field-label"
                            htmlFor="requested-capture"
                        >
                            Pokémon demandé
                        </label>

                        <input
                            className="field"
                            id="requested-capture"
                            type="number"
                            min="1"
                            value={requestedCaptureId}
                            onChange={event =>
                                setRequestedCaptureId(
                                    event.target.value
                                )
                            }
                            placeholder="Identifiant de la capture"
                        />
                    </div>


                    <button
                        type="submit"
                        className="
                            rounded-xl
                            bg-red-600
                            px-6
                            py-3
                            font-bold
                            text-white
                            shadow-md
                            transition
                            hover:-translate-y-0.5
                            hover:bg-red-700
                            hover:shadow-lg
                        "
                    >
                        Proposer l'échange
                    </button>

                </form>


                {message && (
                    <div
                        className="
                            mt-5
                            rounded-xl
                            border
                            border-red-200
                            bg-red-50
                            p-4
                            font-semibold
                            text-red-700
                            dark:border-red-900
                            dark:bg-red-950
                            dark:text-red-200
                        "
                    >
                        {message}
                    </div>
                )}

            </section>


            {/* Trades */}

            <section className="card">

                <div className="mb-6">

                    <p
                        className="
                            text-sm
                            font-bold
                            uppercase
                            tracking-wide
                            text-red-600
                        "
                    >
                        Historique
                    </p>

                    <h2
                        className="
                            mt-1
                            text-2xl
                            font-bold
                        "
                    >
                        Mes échanges
                    </h2>

                </div>


                {trades.length === 0 ? (

                    <div
                        className="
                            rounded-xl
                            border-2
                            border-dashed
                            p-8
                            text-center
                        "
                    >
                        <p className="text-xl font-bold">
                            Aucun échange pour le moment
                        </p>

                        <p className="mt-2 opacity-70">
                            Vos propositions envoyées ou
                            reçues apparaîtront ici.
                        </p>
                    </div>

                ) : (

                    <div className="flex flex-col gap-4">

                        {trades.map(trade => (

                            <article
                                key={trade.id}
                                className="
                                    rounded-2xl
                                    border
                                    p-5
                                    shadow-sm
                                    transition
                                    hover:shadow-md
                                "
                            >

                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-3
                                        sm:flex-row
                                        sm:items-center
                                        sm:justify-between
                                    "
                                >

                                    <div>

                                        <p
                                            className="
                                                text-xs
                                                font-bold
                                                uppercase
                                                opacity-50
                                            "
                                        >
                                            Échange
                                        </p>

                                        <h3
                                            className="
                                                text-xl
                                                font-bold
                                            "
                                        >
                                            Proposition #
                                            {trade.id}
                                        </h3>

                                    </div>


                                    <span
                                        className={
                                            `
                                            rounded-full
                                            px-4
                                            py-1
                                            text-sm
                                            font-bold
                                            ${getStatusStyle(
                                                trade.status
                                            )}
                                            `
                                        }
                                    >
                                        {getStatusLabel(
                                            trade.status
                                        )}
                                    </span>

                                </div>


                                <div
                                    className="
                                        my-5
                                        grid
                                        gap-4
                                        md:grid-cols-2
                                    "
                                >

                                    <div
                                        className="
                                            rounded-xl
                                            bg-gray-50
                                            p-4
                                            dark:bg-gray-900
                                        "
                                    >
                                        <p
                                            className="
                                                text-xs
                                                font-bold
                                                uppercase
                                                opacity-50
                                            "
                                        >
                                            Pokémon proposé
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-lg
                                                font-bold
                                            "
                                        >
                                            {getCaptureName(
                                                trade.offered_capture_id
                                            )}
                                        </p>

                                        <p className="text-sm opacity-60">
                                            Capture #
                                            {
                                                trade.offered_capture_id
                                            }
                                        </p>

                                    </div>


                                    <div
                                        className="
                                            rounded-xl
                                            bg-gray-50
                                            p-4
                                            dark:bg-gray-900
                                        "
                                    >
                                        <p
                                            className="
                                                text-xs
                                                font-bold
                                                uppercase
                                                opacity-50
                                            "
                                        >
                                            Pokémon demandé
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-lg
                                                font-bold
                                            "
                                        >
                                            Capture #
                                            {
                                                trade.requested_capture_id
                                            }
                                        </p>

                                    </div>

                                </div>


                                <div
                                    className="
                                        flex
                                        flex-wrap
                                        gap-4
                                        text-sm
                                        opacity-70
                                    "
                                >
                                    <span>
                                        Joueur #
                                        {trade.from_user_id}
                                    </span>

                                    <span>→</span>

                                    <span>
                                        Joueur #
                                        {trade.to_user_id}
                                    </span>
                                </div>


                                {trade.status === "pending" && (

                                    <div
                                        className="
                                            mt-5
                                            flex
                                            flex-wrap
                                            gap-3
                                        "
                                    >

                                        <button
                                            type="button"
                                            className="
                                                rounded-lg
                                                bg-green-600
                                                px-5
                                                py-2
                                                font-semibold
                                                text-white
                                                transition
                                                hover:bg-green-700
                                            "
                                            onClick={() =>
                                                handleTradeAction(
                                                    trade.id,
                                                    "accept"
                                                )
                                            }
                                        >
                                            Accepter
                                        </button>


                                        <button
                                            type="button"
                                            className="
                                                rounded-lg
                                                bg-red-600
                                                px-5
                                                py-2
                                                font-semibold
                                                text-white
                                                transition
                                                hover:bg-red-700
                                            "
                                            onClick={() =>
                                                handleTradeAction(
                                                    trade.id,
                                                    "refuse"
                                                )
                                            }
                                        >
                                            Refuser
                                        </button>

                                    </div>
                                )}

                            </article>
                        ))}

                    </div>
                )}

            </section>

        </div>
    );
}