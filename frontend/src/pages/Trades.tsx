import { useEffect, useState, type FormEvent } from "react";

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


    useEffect(() => {
        loadCaptures();
        loadPokemons();
        loadTrades();
    }, []);


    async function loadCaptures() {
        try {
            const response = await apiFetch("/captures/");

            if (!response.ok) {
                throw new Error();
            }

            const data = await response.json();
            setCaptures(data);
        } catch {
            setMessage("Unable to load your Pokémon.");
        }
    }


    async function loadPokemons() {
        try {
            const response = await apiFetch("/pokemons");

            if (!response.ok) {
                throw new Error();
            }

            const data = await response.json();
            setPokemons(data);
        } catch {
            setMessage("Unable to load Pokémon data.");
        }
    }


    async function loadTrades() {
        try {
            const response = await apiFetch("/trades/me");

            if (!response.ok) {
                return;
            }

            const data = await response.json();
            setTrades(data);
        } catch {
            // Trade backend may not be available yet.
        }
    }


    function getPokemon(capture: Capture) {
        return pokemons.find(
            pokemon => pokemon.id === capture.pokemon_id
        );
    }


    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setMessage("");

        if (!offeredCaptureId || !targetUserId || !requestedCaptureId) {
            setMessage("Please complete all fields.");
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
                    error.detail ?? "Unable to create trade."
                );

                return;
            }

            setMessage("Trade created successfully!");

            setOfferedCaptureId("");
            setTargetUserId("");
            setRequestedCaptureId("");

            await loadTrades();

        } catch {
            setMessage("Trade service is currently unavailable.");
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
                    error.detail ?? `Unable to ${action} trade.`
                );

                return;
            }

            setMessage(`Trade ${action}ed successfully.`);

            await loadTrades();

        } catch {
            setMessage("Trade service is currently unavailable.");
        }
    }


    return (
        <div className="page">

            <h1 className="text-display text-pokedex-red mb-8">
                Pokémon Trades
            </h1>


            <section className="card mb-8">

                <h2 className="mb-6 text-2xl font-bold">
                    Choose a Pokémon to offer
                </h2>


                {captures.length === 0 ? (
                    <p>
                        You don't have any Pokémon available.
                    </p>
                ) : (

                    <div className="card-grid">

                        {captures.map(capture => {

                            const pokemon = getPokemon(capture);

                            if (!pokemon) {
                                return null;
                            }

                            const selected =
                                offeredCaptureId === String(capture.id);

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
                                            : "rounded-xl border-2 border-transparent p-2 hover:border-red-300"
                                    }
                                >

                                    <PokemonCard
                                        pokemon={pokemon}
                                    />

                                    {capture.nickname && (
                                        <p className="mt-2 font-bold">
                                            {capture.nickname}
                                        </p>
                                    )}

                                    {selected && (
                                        <p className="mt-2 font-bold text-red-600">
                                            Selected
                                        </p>
                                    )}

                                </button>
                            );
                        })}

                    </div>
                )}

            </section>


            <section className="card mb-8">

                <h2 className="mb-6 text-2xl font-bold">
                    Create a trade
                </h2>


                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5"
                >

                    <div>

                        <label className="field-label">
                            Selected Pokémon
                        </label>

                        <div className="field">
                            {offeredCaptureId
                                ? `Capture #${offeredCaptureId}`
                                : "Choose a Pokémon above"}
                        </div>

                    </div>


                    <div>

                        <label
                            className="field-label"
                            htmlFor="target-user"
                        >
                            Target player
                        </label>

                        <input
                            className="field"
                            id="target-user"
                            type="number"
                            min="1"
                            value={targetUserId}
                            onChange={event =>
                                setTargetUserId(event.target.value)
                            }
                            placeholder="Player ID"
                        />

                    </div>


                    <div>

                        <label
                            className="field-label"
                            htmlFor="requested-capture"
                        >
                            Requested Pokémon
                        </label>

                        <input
                            className="field"
                            id="requested-capture"
                            type="number"
                            min="1"
                            value={requestedCaptureId}
                            onChange={event =>
                                setRequestedCaptureId(event.target.value)
                            }
                            placeholder="Capture ID"
                        />

                    </div>


                    <button
                        type="submit"
                        className="
                            rounded-lg
                            bg-red-600
                            px-5 py-3
                            font-bold
                            text-white
                            transition
                            hover:bg-red-700
                        "
                    >
                        Send trade request
                    </button>

                </form>


                {message && (
                    <p className="mt-5 font-semibold">
                        {message}
                    </p>
                )}

            </section>


            <section className="card">

                <h2 className="mb-6 text-2xl font-bold">
                    My trades
                </h2>


                {trades.length === 0 ? (

                    <p>
                        No trades yet.
                    </p>

                ) : (

                    <div className="flex flex-col gap-4">

                        {trades.map(trade => (

                            <article
                                key={trade.id}
                                className="
                                    rounded-xl
                                    border
                                    p-5
                                    shadow-sm
                                "
                            >

                                <div className="flex justify-between">

                                    <h3 className="font-bold">
                                        Trade #{trade.id}
                                    </h3>

                                    <span className="font-semibold">
                                        {trade.status}
                                    </span>

                                </div>


                                <div className="mt-4 grid gap-2 md:grid-cols-2">

                                    <p>
                                        From player #{trade.from_user_id}
                                    </p>

                                    <p>
                                        To player #{trade.to_user_id}
                                    </p>

                                    <p>
                                        Offered capture #{trade.offered_capture_id}
                                    </p>

                                    <p>
                                        Requested capture #{trade.requested_capture_id}
                                    </p>

                                </div>


                                {trade.status === "pending" && (

                                    <div className="mt-5 flex gap-3">

                                        <button
                                            type="button"
                                            className="
                                                rounded
                                                bg-green-600
                                                px-4 py-2
                                                text-white
                                            "
                                            onClick={() =>
                                                handleTradeAction(
                                                    trade.id,
                                                    "accept"
                                                )
                                            }
                                        >
                                            Accept
                                        </button>


                                        <button
                                            type="button"
                                            className="
                                                rounded
                                                bg-red-600
                                                px-4 py-2
                                                text-white
                                            "
                                            onClick={() =>
                                                handleTradeAction(
                                                    trade.id,
                                                    "refuse"
                                                )
                                            }
                                        >
                                            Refuse
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