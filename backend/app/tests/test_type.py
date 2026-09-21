def test_create_type(client):
    response = client.post("/types/", json={"name": "fire"})
    assert response.status_code == 201
    assert response.json()["name"] == "fire"


def test_create_type_duplicate(client):
    client.post("/types/", json={"name": "water"})
    response = client.post("/types/", json={"name": "water"})
    assert response.status_code == 409


def test_list_types(client):
    client.post("/types/", json={"name": "grass"})
    response = client.get("/types/")
    assert response.status_code == 200
    assert any(t["name"] == "grass" for t in response.json())


def test_update_type_not_found(client):
    response = client.put("/types/9999", json={"name": "electric"})
    assert response.status_code == 404


def test_delete_type_not_found(client):
    response = client.delete("/types/9999")
    assert response.status_code == 404