def test_register_user(client):
    response = client.post(
        "/auth/register",
        json={
            "username": "testuser",
            "email": "testuser@test.fr",
            "password": "Password1"
        }
    )

    assert response.status_code in [200, 201]
    assert response.json()["username"] == "testuser"
    assert response.json()["email"] == "testuser@test.fr"


def test_register_duplicate_email(client):
    user = {
        "username": "duplicate1",
        "email": "duplicate@test.fr",
        "password": "Password1"
    }

    client.post("/auth/register", json=user)

    response = client.post(
        "/auth/register",
        json={
            "username": "duplicate2",
            "email": "duplicate@test.fr",
            "password": "Password1"
        }
    )

    assert response.status_code in [400, 409]


def test_login_user(client):
    client.post(
        "/auth/register",
        json={
            "username": "loginuser",
            "email": "login@test.fr",
            "password": "Password1"
        }
    )

    response = client.post(
        "/auth/login",
        json={
            "email": "login@test.fr",
            "password": "Password1"
        }
    )

    assert response.status_code == 200
    assert "access_token" in response.json()


def test_login_wrong_password(client):
    client.post(
        "/auth/register",
        json={
            "username": "wrongpassword",
            "email": "wrong@test.fr",
            "password": "Password1"
        }
    )

    response = client.post(
        "/auth/login",
        json={
            "email": "wrong@test.fr",
            "password": "MauvaisPassword1"
        }
    )

    assert response.status_code == 400

def test_users_me_without_token(client):
    response = client.get("/users/me")

    assert response.status_code == 401


def test_users_me_with_token(client):
    client.post(
        "/auth/register",
        json={
            "username": "meuser",
            "email": "me@test.fr",
            "password": "Password1"
        }
    )

    login = client.post(
        "/auth/login",
        json={
            "email": "me@test.fr",
            "password": "Password1"
        }
    )

    token = login.json()["access_token"]

    response = client.get(
        "/users/me",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 200
    assert response.json()["email"] == "me@test.fr"    