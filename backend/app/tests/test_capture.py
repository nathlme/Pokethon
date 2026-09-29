import pytest
from app.main import app, get_current_user
from app.models.pokemons import Pokemon


class FakeUser:
    id = 1


def override_get_current_user():
    return FakeUser()


@pytest.fixture(autouse=True)
def override_auth():
    app.dependency_overrides[get_current_user] = override_get_current_user
    yield


@pytest.fixture(autouse=True)
def pokemons(db_session):
    for pokemon_id in (1, 2, 3):
        db_session.add(Pokemon(
            id=pokemon_id, name=f"poke{pokemon_id}", type="normal",
            sprite_url="http://sprite", hp=10, attack=10, defense=10, speed=10,
        ))
    db_session.commit()


def test_catch_pokemon(client):
    response = client.post("/captures/", json={"pokemon_id": 1, "nickname": "Sparky"})
    assert response.status_code == 201
    assert response.json()["pokemon_id"] == 1
    assert response.json()["user_id"] == 1


def test_catch_unknown_pokemon(client):
    response = client.post("/captures/", json={"pokemon_id": 9999})
    assert response.status_code == 404


def test_list_my_captures(client):
    client.post("/captures/", json={"pokemon_id": 2})
    response = client.get("/captures/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_capture(client):
    capture_id = client.post("/captures/", json={"pokemon_id": 1}).json()["id"]
    response = client.get(f"/captures/{capture_id}")
    assert response.status_code == 200
    assert response.json()["id"] == capture_id


def test_rename_capture(client):
    capture_id = client.post("/captures/", json={"pokemon_id": 1}).json()["id"]
    response = client.patch(f"/captures/{capture_id}", json={"nickname": "Pikachu"})
    assert response.status_code == 200
    assert response.json()["nickname"] == "Pikachu"


def test_delete_capture_not_owner(client):
    create = client.post("/captures/", json={"pokemon_id": 3})
    capture_id = create.json()["id"]

    def override_other_user():
        class OtherUser:
            id = 999
        return OtherUser()

    app.dependency_overrides[get_current_user] = override_other_user
    response = client.delete(f"/captures/{capture_id}")
    assert response.status_code == 403


def test_delete_capture_not_found(client):
    response = client.delete("/captures/9999")
    assert response.status_code == 404
