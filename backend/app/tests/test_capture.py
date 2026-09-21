import pytest
from app.main import app, get_current_user


class FakeUser:
    id = 1


def override_get_current_user():
    return FakeUser()


@pytest.fixture(autouse=True)
def override_auth():
    app.dependency_overrides[get_current_user] = override_get_current_user
    yield


def test_catch_pokemon(client):
    response = client.post("/captures/", json={"pokemon_id": 1, "nickname": "Sparky"})
    assert response.status_code == 201
    assert response.json()["pokemon_id"] == 1
    assert response.json()["user_id"] == 1


def test_list_my_captures(client):
    client.post("/captures/", json={"pokemon_id": 2})
    response = client.get("/captures/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


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