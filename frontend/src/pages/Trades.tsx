export default function Trades() {
    return (
        <main>
            <h1>Trades</h1>

            <section>
                <h2>Create a trade</h2>

                <form>
                    <label htmlFor="offered-capture">
                        Pokémon to offer:
                    </label>

                    <select id="offered-capture">
                        <option value="">Choose a Pokémon</option>
                    </select>

                    <br />

                    <label htmlFor="target-user">
                        Player:
                    </label>

                    <select id="target-user">
                        <option value="">Choose a player</option>
                    </select>

                    <br />

                    <label htmlFor="requested-capture">
                        Requested Pokémon:
                    </label>

                    <select id="requested-capture">
                        <option value="">Choose a Pokémon</option>
                    </select>

                    <br />

                    <button type="submit">
                        Create trade
                    </button>
                </form>
            </section>

            <section>
                <h2>Received trades</h2>

                <article>
                    <p>From: Example player</p>
                    <p>Offered Pokémon: Pikachu</p>
                    <p>Requested Pokémon: Squirtle</p>

                    <button type="button">
                        Accept
                    </button>

                    <button type="button">
                        Refuse
                    </button>
                </article>
            </section>

            <section>
                <h2>Sent trades</h2>

                <article>
                    <p>Recipient: Example player</p>
                    <p>Offered Pokémon: Bulbasaur</p>
                    <p>Requested Pokémon: Charmander</p>
                    <p>Status: Pending</p>
                </article>
            </section>
        </main>
    );
}