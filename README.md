# Pokethon

compte rendu seance 1:

1 : affinage du projet en global
2 : gestion de projet
3 : gestion des taches / features par personnes => les membres du groupes sont maintenant autonomes
4 : premiers push selon peronnes -voir commit-


tessa: modéles Team et TeamSlot créer pour les tables SQL et création de database temporaire

nicolas: feat(achievement): creation of a database, a docker compose, a achievement and a userachievement class, some import and things in the main to make it work 

Nathan: composants "Login" et "Register" contenant les formulaires de connexion et d'inscription (avec vérification de mot de passe). Travail réalisé sur la branche feat/auth.

felix: > J'ai mis en place le socle backend (dépendances, .gitignore, connexion PostgreSQL/SQLAlchemy) sur ma branche back/type-crud, commité et pushé. Prêt à coder le modèle Type ensuite.**


louis absent: on lui communique demain


compte rendu seance 2:

tessa : absente elle a eu certain détail mais aura tout demain 

nicolas: réalisation du css global qui sera appliquer à toutes les pages actuel ou future, création de la navbar avec un bouton clair/sombre avec une pokeball pour clair et hyperball pour sombre et commencement des grud pour les achievements ( non push encore car ce n'est pas fini )

Nathan Lamarche : J'ai merge la branche "feat/auth" a "dev". Création de la page 'Pokedex' avec un type 'pokemon' et un composant 'PokemonCard' sur la branche "feat/pokedex". Ajout d'une barre de rechercher dynamique et d'un filtrage par type. Premier appel API pour récupérer les Pokémons vers la future API avec gestion d'erreur.

felix : livré le CRUD complet de Type (modèle, schémas, migration Alembic, router, tests) sur back/type-crud, la structure statique de la page Détail Pokémon sur front/pokemon-detail-page, et le squelette du modèle Capture sur back/capture-skeleton — les trois branches pushées sur GitHub.

Jeannot Louis : j'ai crée la branch feat/trade-note pour faire les premiers models du trade et du note et ai donc crée et push les fichiers trade.py et note.py j'ai aussi crée la branch feat/trade-front pour faire un premier d'une page statique pour les trades Trades.tsx et push, je suis revenue après en back sur la branch feat/trade-note pour rajouter les schemas liés au models fait pltôt branch mise à jour





Lien GitHub : https://github.com/nathlme/Pokethon.git