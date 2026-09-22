export default function Trades() {
    return (
        <main>
            <h1>Échanges</h1>

            <section>
                <h2>Proposer un échange</h2>

                <form>
                    <label htmlFor="offered-capture">
                        Pokémon à offrir :
                    </label>

                    <select id="offered-capture">
                        <option value="">Choisir un Pokémon</option>
                    </select>

                    <br />

                    <label htmlFor="target-user">
                        Joueur :
                    </label>

                    <select id="target-user">
                        <option value="">Choisir un joueur</option>
                    </select>

                    <br />

                    <label htmlFor="requested-capture">
                        Pokémon demandé :
                    </label>

                    <select id="requested-capture">
                        <option value="">Choisir un Pokémon</option>
                    </select>

                    <br />

                    <button type="submit">
                        Proposer l'échange
                    </button>
                </form>
            </section>

            <section>
                <h2>Échanges reçus</h2>

                <article>
                    <p>Échange proposé par : Joueur exemple</p>
                    <p>Il propose : Pikachu</p>
                    <p>Il demande : Carapuce</p>

                    <button type="button">Accepter</button>
                    <button type="button">Refuser</button>
                </article>
            </section>

            <section>
                <h2>Échanges envoyés</h2>

                <article>
                    <p>Destinataire : Joueur exemple</p>
                    <p>Vous proposez : Bulbizarre</p>
                    <p>Vous demandez : Salamèche</p>
                    <p>Statut : En attente</p>
                </article>
            </section>
        </main>
    );
}