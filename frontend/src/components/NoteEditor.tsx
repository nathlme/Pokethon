import { useEffect, useState, type FormEvent } from "react";
import apiFetch from "../services/api";

type Note = {
    id: number;
    capture_id: number;
    content: string;
};

type NoteEditorProps = {
    captureId: number;
};

export default function NoteEditor({ captureId }: NoteEditorProps) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [content, setContent] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        setContent("");
        setEditingId(null);
        loadNotes();
    }, [captureId]);

    async function loadNotes() {
        setLoading(true);

        try {
            const response = await apiFetch(
                `/notes/capture/${captureId}`
            );

            if (!response.ok) {
                throw new Error();
            }

            const data: Note[] = await response.json();
            setNotes(data);
            setMessage("");
        } catch {
            setMessage("Impossible de charger les notes.");
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!content.trim() || saving) return;

        setSaving(true);
        setMessage("");

        const endpoint = editingId === null
            ? "/notes/"
            : `/notes/${editingId}`;

        try {
            const response = await apiFetch(endpoint, {
                method: editingId === null ? "POST" : "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    editingId === null
                        ? {
                            capture_id: captureId,
                            content: content.trim(),
                        }
                        : {
                            content: content.trim(),
                        }
                ),
            });

            if (!response.ok) {
                throw new Error();
            }

            setContent("");
            setEditingId(null);

            await loadNotes();

            setMessage("Note enregistrée avec succès.");
        } catch {
            setMessage("Impossible d'enregistrer la note.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(noteId: number) {
        if (saving) return;

        setSaving(true);
        setMessage("");

        try {
            const response = await apiFetch(`/notes/${noteId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error();
            }

            if (editingId === noteId) {
                setEditingId(null);
                setContent("");
            }

            await loadNotes();

            setMessage("Note supprimée.");
        } catch {
            setMessage("Impossible de supprimer la note.");
        } finally {
            setSaving(false);
        }
    }

    function handleEdit(note: Note) {
        setEditingId(note.id);
        setContent(note.content);
        setMessage("");
    }

    function handleCancel() {
        setEditingId(null);
        setContent("");
    }

    return (
        <section className="card mt-6">
            <h2 className="mb-2 text-2xl font-bold">
                Carnet de notes
            </h2>

            <p className="mb-5 text-sm opacity-70">
                Ajoutez vos observations personnelles sur ce Pokémon.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <label htmlFor="note-content" className="field-label">
                    {editingId === null
                        ? "Nouvelle note"
                        : "Modifier la note"}
                </label>

                <textarea
                    id="note-content"
                    className="field min-h-28"
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    placeholder="Vos observations sur ce Pokémon..."
                    maxLength={1000}
                />

                <div className="flex flex-wrap gap-3">
                    <button
                        className="btn-primary"
                        type="submit"
                        disabled={saving || !content.trim()}
                    >
                        {saving
                            ? "Enregistrement..."
                            : editingId === null
                                ? "Ajouter la note"
                                : "Enregistrer les modifications"}
                    </button>

                    {editingId !== null && (
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={saving}
                            className="rounded-lg border px-4 py-2"
                        >
                            Annuler
                        </button>
                    )}
                </div>
            </form>

            {message && (
                <p role="status" className="mt-4 text-sm font-medium">
                    {message}
                </p>
            )}

            <div className="mt-8">
                <h3 className="mb-4 font-bold">
                    Notes enregistrées ({notes.length})
                </h3>

                {loading ? (
                    <p>Chargement des notes...</p>
                ) : notes.length === 0 ? (
                    <div className="rounded-xl border border-dashed p-5 text-center opacity-70">
                        Aucune note pour cette capture.
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {notes.map((note) => (
                            <article
                                key={note.id}
                                className="rounded-xl border p-4"
                            >
                                <p className="whitespace-pre-wrap">
                                    {note.content}
                                </p>

                                <div className="mt-4 flex gap-3">
                                    <button
                                        type="button"
                                        disabled={saving}
                                        onClick={() => handleEdit(note)}
                                        className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                                    >
                                        Modifier
                                    </button>

                                    <button
                                        type="button"
                                        disabled={saving}
                                        onClick={() => handleDelete(note.id)}
                                        className="rounded-lg border px-3 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-950"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}