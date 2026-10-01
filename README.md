# Pokethon — PokéDex & Collection

Application web full-stack de collection de Pokémon : explorez le Pokédex, capturez vos Pokémon, composez votre équipe, échangez avec les autres dresseurs et débloquez des badges.

Projet scolaire réalisé en groupe de 5, qui couvre à la fois le TP React (frontend) et le TP FastAPI (backend).

## Fonctionnalités

- **Authentification** : inscription et connexion (mot de passe haché, jeton JWT), routes protégées côté frontend.
- **Pokédex** : liste des Pokémon avec recherche dynamique et filtres par type, page de détail pour chaque Pokémon.
- **Collection** : capture de Pokémon (surnom, date de capture) et notes associées à chaque capture.
- **Équipe** : 6 emplacements, assemblage manuel des captures ou **génération automatique par types**.
- **Échanges (Trades)** : proposition, acceptation et refus d'échanges entre dresseurs.
- **Badges (Achievements)** : attribution automatique selon des seuils (découverte, collection, équipe complète, maîtrise d'un type).
- **Thème clair / sombre** : bascule dans la barre de navigation (Pokéball / Hyperball).

## Stack technique

| Couche | Technologies |
|---|---|
| Frontend | React 19, TypeScript, React Router, Tailwind CSS 4, Vite |
| Backend | FastAPI, SQLAlchemy, Alembic, Pydantic, JWT |
| Base de données | PostgreSQL 16 (Docker) — SQLite en mémoire pour les tests |
| API tierce | [PokeAPI](https://pokeapi.co), appelée par le backend pour importer les Pokémon |

## Structure du projet

```
Pokethon/
├── backend/
│   ├── app/
│   │   ├── main.py            # Point d'entrée FastAPI + routes /auth et /users/me
│   │   ├── database.py        # Connexion SQLAlchemy
│   │   ├── security.py        # Hachage des mots de passe, JWT
│   │   ├── dependencies.py    # get_current_user
│   │   ├── models/            # Modèles SQLAlchemy
│   │   ├── schemas/           # Schémas Pydantic
│   │   ├── routers/           # Endpoints par ressource
│   │   ├── services/          # Logique métier (badges, équipe, sync PokeAPI)
│   │   ├── scripts/           # seed_achievements.py
│   │   └── tests/             # Tests (pytest)
│   ├── alembic/               # Migrations
│   ├── tests/                 # Tests Team / TeamSlot
│   ├── import_pokemons.py     # Import des Pokémon depuis PokeAPI
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/             # Pokedex, PokemonDetail, CollectionPage, Trades, Login, Register
│   │   ├── components/        # Navbar, PokemonCard, AchievementCard, NoteEditor, PrivateRoute
│   │   ├── services/api.ts    # Appels à l'API
│   │   └── types/
│   ├── global.css
│   └── index.html
├── docker-compose.yml         # PostgreSQL
├── vite.config.ts
└── package.json
```

## Installation

### Prérequis

- Node.js (npm)
- Python 3.11+
- Docker (pour PostgreSQL)

### 1. Cloner le dépôt

```bash
git clone https://github.com/nathlme/Pokethon.git
cd Pokethon
```

### 2. Base de données

```bash
docker compose up -d
```

Le conteneur `pokedex-postgres` démarre sur le port `5432` (utilisateur `postgres`, mot de passe `postgres`).

> ⚠️ Le `docker-compose.yml` crée une base nommée `pokedex`, alors que le backend se connecte par défaut à une base `pokethon`. Soit vous créez la base `pokethon` (par exemple avec pgAdmin), soit vous définissez `DATABASE_URL` vers `pokedex` (voir ci-dessous).

### 3. Backend

```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux / macOS
source .venv/bin/activate

pip install -r backend/requirements.txt
pip install PyJWT "pwdlib[argon2]" python-dotenv
```

> `PyJWT`, `pwdlib` et `python-dotenv` sont utilisés par `security.py` mais ne figurent pas encore dans `requirements.txt` : pensez à les y ajouter.

Créez un fichier `.env` (à la racine ou dans `backend/`) :

```env
SECRET_KEY=une-longue-chaine-aleatoire
# Optionnel : par défaut postgresql://postgres:postgres@localhost:5432/pokethon
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pokethon
```

Les tables sont créées automatiquement au démarrage de l'API (`Base.metadata.create_all`).

### 4. Données initiales

Depuis le dossier `backend` :

```bash
# Importer les Pokémon depuis PokeAPI (20 par défaut, ici les 151 de Kanto)
python import_pokemons.py 151

# Créer les badges (idempotent)
python -m app.scripts.seed_achievements
```

### 5. Frontend

À la racine du projet :

```bash
npm install
```

## Lancer le projet

Frontend et backend en une commande (le script utilise le venv Windows `.venv\Scripts\python.exe`) :

```bash
npm run dev:all
```

Ou séparément :

```bash
# Frontend — http://localhost:5173
npm run dev

# Backend — http://127.0.0.1:8000
python -m uvicorn app.main:app --reload --app-dir backend
```

Documentation interactive de l'API : <http://127.0.0.1:8000/docs>

## API

| Ressource | Préfixe | Endpoints principaux |
|---|---|---|
| Authentification | `/auth` | `POST /auth/register`, `POST /auth/login`, `GET /users/me` |
| Pokémon | `/pokemons` | `GET /pokemons`, `GET /pokemons/{id}` |
| Types | `/types` | CRUD complet |
| Captures | `/captures` | `GET`, `POST`, `PATCH`, `DELETE` |
| Notes | `/notes` | `POST`, `GET /capture/{capture_id}`, `GET`, `PUT`, `DELETE` |
| Équipe | `/teams` | `GET /me`, `POST`, `PUT /{id}`, `POST /auto-generate` |
| Emplacements | `/team-slots` | `POST`, `DELETE /{id}` |
| Échanges | `/trades` | `POST`, `GET /me`, `PUT /{id}/accept`, `PUT /{id}/refuse` |
| Badges | `/achievements` | CRUD, `GET /me` pour ses badges débloqués |

## Badges

Les badges sont vérifiés après chaque capture ou échange.

| Famille | Condition |
|---|---|
| Découverte | 5, 10, 20, 50, 100 ou 151 espèces **différentes** capturées |
| Collection | 10, 25 ou 50 captures (doublons inclus) |
| Stratège | Équipe complète de 6 Pokémon |
| Maître d'un type | Avoir capturé tous les Pokémon d'un type |

## Tests

Depuis le dossier `backend` :

```bash
pytest
```

Les tests utilisent une base SQLite en mémoire : aucune configuration PostgreSQL n'est nécessaire.

## Organisation du travail

- Mono-repo `backend/` + `frontend/`
- Branches `back/<ressource>` et `front/<page>`, intégrées dans `dev` par pull request
- Comptes rendus des séances : [docs/comptes-rendus.md](docs/comptes-rendus.md)

## Équipe

Tessa, Nicolas, Nathan, Félix et Louis.

## Lien

Dépôt GitHub : <https://github.com/nathlme/Pokethon>