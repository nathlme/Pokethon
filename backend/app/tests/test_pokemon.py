import pytest

from app.models.pokemons import Pokemon
from app.models.type import Type


@pytest.fixture
def sample_pokemon(db_session):
    grass = Type(name="Plante")
    poison = Type(name="Poison")

    pokemon = Pokemon(
        id=1,
        name="Bulbasaur",
        type="Plante",
        sprite_url="https://example.com/bulbasaur.png",
        hp=45,
        attack=49,
        defense=49,
        speed=45,
    )

    pokemon.types.append(grass)
    pokemon.types.append(poison)

    db_session.add(pokemon)
    db_session.commit()
    db_session.refresh(pokemon)

    return pokemon


def test_list_pokemons(client, sample_pokemon):
    response = client.get("/pokemons")

    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) >= 1


def test_get_pokemon(client, sample_pokemon):
    response = client.get("/pokemons/1")

    assert response.status_code == 200
    assert response.json()["id"] == 1
    assert response.json()["name"] == "Bulbasaur"


def test_get_pokemon_not_found(client):
    response = client.get("/pokemons/999999")

    assert response.status_code == 404


def test_search_pokemon(client, sample_pokemon):
    response = client.get("/pokemons?search=Bulba")

    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["name"] == "Bulbasaur"


def test_filter_pokemon_by_type(client, sample_pokemon):
    response = client.get("/pokemons?type=Poison")

    assert response.status_code == 200

    pokemons = response.json()

    assert len(pokemons) == 1
    assert pokemons[0]["name"] == "Bulbasaur"

    assert any(
        pokemon_type["name"] == "Poison"
        for pokemon_type in pokemons[0]["types"]
    )