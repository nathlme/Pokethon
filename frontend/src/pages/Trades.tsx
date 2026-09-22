import { FormEvent, useEffect, useState } from "react";
import apiFetch from "../services/api";

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
    const [trades, setTrades] = useState<Trade[]>([]);

    const [offeredCaptureId, setOfferedCaptureId] = useState("");
    const [targetUserId, setTargetUserId] = useState("");
    const [requestedCaptureId, setRequestedCaptureId] = useState("");

    const [message, setMessage] = useState("");

    useEffect(() => {
        loadCaptures();
        loadTrades();
    }, []);

    async function loadCaptures() {
        try {
            const response = await apiFetch("/captures/");

            if (!response.ok) {
                throw new Error("Unable to load captures");
            }

            const data = await response.json();
            setCaptures(data);
        } catch {
            setMessage("Unable to load your Pokémon.");
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
                setMessage(error.detail ?? "Unable to create trade.");
                return;
            }

            setMessage("Trade created successfully.");

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
            const response = await apiFetch(`/trades/${tradeId}/${action}`, {
                method: "PUT",
            });

            if (!response.ok) {
                const error = await response.json();
                setMessage(error.detail ?? `Unable to ${action} trade.`);
                return;
            }

            setMessage(`Trade ${action}ed successfully.`);
            await loadTrades();
        } catch {
            setMessage("Trade service is currently unavailable.");
        }
    }

    const receivedTrades = trades.filter(
        trade => trade.to_user_id !== undefined
    );

    return (
        <div className="mx-auto max-w-5xl p-6">
            <h1 className="mb-8 text-3xl font-bold">
                Trades
            </h1>

            <section className="mb-10 rounded-lg border p-6">
                <h2 className="mb-4 text-xl font-semibold">
                    Create a trade
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                >
                    <label>
                        Pokémon to offer
                        <select
                            className="mt-1 w-full rounded border p-2"
                            value={offeredCaptureId}
                            onChange={event =>
                                setOfferedCaptureId(event.target.value)
                            }
                        >
                            <option value="">
                                Choose a Pokémon
                            </option>

                            {captures.map(capture => (
                                <option
                                    key={capture.id}
                                    value={capture.id}
                                >
                                    {capture.nickname ??
                                        `Pokémon #${capture.pokemon_id}`}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Target player ID
                        <input
                            className="mt-1 w-full rounded border p-2"
                            type="number"
                            min="1"
                            value={targetUserId}
                            onChange={event =>
                                setTargetUserId(event.target.value)
                            }
                            placeholder="Player ID"
                        />
                    </label>

                    <label>
                        Requested capture ID
                        <input
                            className="mt-1 w-full rounded border p-2"
                            type="number"
                            min="1"
                            value={requestedCaptureId}
                            onChange={event =>
                                setRequestedCaptureId(event.target.value)
                            }
                            placeholder="Capture ID"
                        />
                    </label>

                    <button
                        type="submit"
                        className="rounded bg-red-600 px-4 py-2 font-semibold text-white"
                    >
                        Create trade
                    </button>
                </form>

                {message && (
                    <p className="mt-4">
                        {message}
                    </p>
                )}
            </section>

            <section className="mb-10">
                <h2 className="mb-4 text-xl font-semibold">
                    My trades
                </h2>

                {trades.length === 0 ? (
                    <p>No trades yet.</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {receivedTrades.map(trade => (
                            <article
                                key={trade.id}
                                className="rounded-lg border p-4"
                            >
                                <p>
                                    From user: {trade.from_user_id}
                                </p>

                                <p>
                                    To user: {trade.to_user_id}
                                </p>

                                <p>
                                    Offered capture: #{trade.offered_capture_id}
                                </p>

                                <p>
                                    Requested capture: #{trade.requested_capture_id}
                                </p>

                                <p>
                                    Status: {trade.status}
                                </p>

                                {trade.status === "pending" && (
                                    <div className="mt-3 flex gap-2">
                                        <button
                                            type="button"
                                            className="rounded bg-green-600 px-3 py-2 text-white"
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
                                            className="rounded bg-red-600 px-3 py-2 text-white"
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