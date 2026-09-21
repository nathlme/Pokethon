def test_add_capture_to_team_success(client, auth_headers, sample_capture):
    team_resp = client.post("/teams/", json={"name": "Équipe"}, headers=auth_headers)
    team_id = team_resp.json()["id"]

    response = client.post(
        "/team-slots/",
        json={"team_id": team_id, "capture_id": sample_capture.id, "position": 1},
        headers=auth_headers,
    )
    assert response.status_code == 201
    assert response.json()["position"] == 1

def test_add_capture_invalid_position(client, auth_headers, sample_capture):
    response = client.post(
        "/team-slots/",
        json={"team_id": 1, "capture_id": sample_capture.id, "position": 8},
        headers=auth_headers,
    )
    assert response.status_code == 422