def test_create_team_success(client, auth_headers):
    response = client.post("/teams/", json={"name": "Mon équipe"}, headers=auth_headers)
    assert response.status_code == 201
    assert response.json()["name"] == "Mon équipe"


def test_create_team_conflict_if_already_exists(client, auth_headers):
    client.post("/teams/", json={"name": "Équipe 1"}, headers=auth_headers)
    response = client.post("/teams/", json={"name": "Équipe 2"}, headers=auth_headers)
    assert response.status_code == 409


def test_get_my_team_not_found(client, auth_headers):
    response = client.get("/teams/me", headers=auth_headers)
    assert response.status_code == 404