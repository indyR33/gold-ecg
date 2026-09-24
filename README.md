# Gold ECG 🪙📊

> **Institutional-grade Real-Time Spot Gold (XAU) Tracker, Financial RSS Semantic Sentiment Engine, and Macroeconomic Driver Dashboard.**

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![DevSecOps](https://img.shields.io/badge/Security-DevSecOps_Verified-10B981?logo=shield&logoColor=white)](#security--devsecops)
[![License](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)

**Languages:** [English](#-table-of-contents) | [Français (French)](#-table-des-matières)

</div>

---

<a name="english"></a>
## 🇬🇧 English Documentation

### 📑 Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Project Directory Structure](#project-directory-structure)
- [Integrated API Endpoints & Server Proxies](#integrated-api-endpoints--server-proxies)
- [Getting Started & Installation](#getting-started--installation)
- [Sentiment Analysis Methodology](#sentiment-analysis-methodology)
- [Macroeconomic Indicators & Data Sources](#macroeconomic-indicators--data-sources)
- [Security & DevSecOps](#security--devsecops)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [License](#license)

---

### Overview

**Gold ECG** is a dedicated analytical platform designed for physical and paper gold investors, analysts, and traders. It combines two critical market components into a synchronized workspace:
1. **Live Spot Gold (XAU) Pricing:** Tick-by-tick market monitoring featuring TradingView institutional charts (GoldAPI.io standard) alongside lightweight high-precision SVG vector curves.
2. **Quantitative Financial RSS Sentiment:** A domain-tailored NLP sentiment engine that ingests, sanitizes, and evaluates French financial news wires (ABC Bourse, TradingSat, Agefi, Le Monde, Le Figaro, Les Echos) to generate an aggregate sentiment score and statistical confidence index.

---

### Key Features

#### 1. Real-Time Spot Gold Tracker & Dual Chart Engine
- **GoldAPI Pro (TradingView):** Official interbank feeds (`FOREXCOM:XAUUSD`, `FOREXCOM:XAUEUR`, etc.) with period selector (1D, 5D, 1M, 1Y, ALL) and volume tracking.
- **Precision SVG Engine:** Interactive local vector charts with hover crosshairs, milestone data points, and min/avg/max pricing ranges.
- **Multi-Currency Support:** USD ($), EUR (€), GBP (£), CHF (Fr).
- **International Weight Units:** Troy Ounce (oz), Gram (g), Kilogram (kg).
- **Market Execution Dashboard:** Instant spot rates, 24h change (net & %), Bid / Ask / Spread matrix, and 24h day-range progress meter.

#### 2. Consolidated Market Sentiment Gauge
- **Score scale from -100 (Strong Bearish / Sell) to +100 (Strong Bullish / Buy).**
- **Animated SVG Tachometer:** Real-time needle pivot responding to weighted sentiment shifts.
- **Dynamic Confidence Score:** Computed based on sample volume, source diversity, and editorial consensus.
- **Categorical Breakdown:** Quantitative distribution of bullish, neutral, and bearish headlines.
- **Dominant Driver Identification:** Automated extraction of high-impact macroeconomic keywords.

#### 3. Live French Financial News Stream
- **Multi-source RSS Aggregation:** ABC Bourse, TradingSat, Agefi (Commodities & Macro), Le Figaro Bourse, France Bourse, Le Monde Économie, Les Echos.
- **Interactive Filtering:** Instant keyword search, polarity filters (All, Bullish, Neutral, Bearish), and per-source toggle controls.
- **Granular Article Scoring:** Every headline displays detected keywords, timestamp, source provenance, and directional impact.

#### 4. Verified Macroeconomic Catalysts
- **US Dollar Index (DXY):** Tracked via TradingView (`TVC:DXY` at `101.230`).
- **US 10-Year Treasury Yield:** Monitored via Investing.com FR (`5,124%`).
- **Central Bank Net Gold Purchases:** Sourced from ConvertirOr.fr / World Gold Council (**1,045 tonnes in 2024**, detail for Poland, Turkey, India, China PBoC).
- **BRICS+ De-dollarization:** Accounting for >60% of annual official net central bank reserves growth.

#### 5. Financial Headline Simulator
- Interactive sandbox allowing analysts to craft hypothetical market headlines and test the lexical scoring model in real time.

---

### System Architecture

| Tier / Component | Tech Stack | Responsibility |
|---|---|---|
| **Frontend UI** | **React 19** + **TypeScript** | Responsive functional components, modular hooks |
| **Styling System** | **Tailwind CSS v4** | Dark financial terminal theme (Slate / Amber / Emerald / Rose) |
| **Tooling & Server** | **Vite 8** | Ultra-fast HMR, optimized production bundler, API proxy server |
| **API Proxies** | **Node.js / Express Middleware** | CORS bypass, RSS XML parsing, sanitized JSON normalization |
| **Charting Engine** | **TradingView Symbol Overview** | Embedded canvas rendering with real-time financial quotes |
| **Security Lifecycle**| **DevSecOps Standards** | Zero exposed secrets, client-side input sanitization, strict typing |

---

### Project Directory Structure

```text
├── index.html                  # HTML5 entry point & OpenGraph metadata
├── metadata.json               # Application metadata & capabilities
├── package.json                # Project dependencies & scripts
├── tsconfig.json               # TypeScript strict configuration
├── vite.config.ts              # Vite config & integrated backend proxy middleware
├── src/
│   ├── main.tsx                # React root mount point
│   ├── App.tsx                 # Core application state, tabs, and layout
│   ├── index.css               # Global styling and Tailwind CSS v4 imports
│   ├── components/
│   │   ├── Header.tsx                 # Navigation bar, dual Paris/NY clocks & quick actions
│   │   ├── GoldPriceWidget.tsx        # Spot tracker, Bid/Ask/Spread & consolidated chart
│   │   ├── GoldApiTradingViewWidget.tsx # Embedded TradingView widget (GoldAPI.io format)
│   │   ├── SentimentGauge.tsx         # Semicircular tachometer & confidence analytics
│   │   ├── HeadlineStream.tsx         # Real-time RSS news feed with multi-filter controls
│   │   ├── MarketEconomics.tsx        # Macro drivers (DXY, US10Y, Central Banks, BRICS+)
│   │   └── HeadlineSimulator.tsx      # Interactive sandbox for testing the NLP sentiment engine
│   ├── services/
│   │   ├── goldPriceService.ts        # Currency/weight conversion tables & spread calculators
│   │   ├── rssService.ts              # Multi-channel RSS parsers with failover resilience
│   │   └── sentimentEngine.ts         # Lexicon-based NLP engine & statistical confidence formula
│   └── types/
│       └── index.ts                   # Strongly typed contracts (GoldData, Headline, FeedConfig)
```

---

### Integrated API Endpoints & Server Proxies

To prevent cross-origin resource sharing (CORS) blocks and sanitize external data before client consumption, the Vite server provides proxy routes:

- **`GET /api/gold-price`**: Fetches the official spot gold price from goldprice.org.
- **`GET /api/goldapi-quote`**: Delivers a full quote payload conforming to the `GoldAPI.io` standard format.
- **`GET /api/rss-feeds`**: Concurrently queries verified French financial RSS feeds, strips unsafe HTML/CDATA tags, and returns normalized JSON.

---

### Getting Started & Installation

#### Prerequisites
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 (or **pnpm** / **yarn**)

#### 1. Clone the repository
```bash
git clone https://github.com/votre-compte/gold-ecg.git
cd gold-ecg
```

#### 2. Install dependencies
```bash
npm install
```

#### 3. Start development server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

#### 4. Build for production
```bash
npm run build
```
Compiled production-ready assets will be generated in the `dist/` directory.

---

### Sentiment Analysis Methodology

The sentiment engine (`src/services/sentimentEngine.ts`) tokenizes and scores headlines using a contextual French financial dictionary:
- **Bullish Drivers (+1 to +3):** Rate cuts, monetary easing, physical demand, safe haven, central bank buying, historical records, geopolitics, rally, de-dollarization.
- **Bearish Drivers (-1 to -3):** Rate hikes, stronger dollar, monetary tightening, profit-taking, ETF outflows, market pullback, selloff.
- **Confidence Formula:**
  $$\text{Confidence} = \min\left(95, \max\left(35, (\text{Sample Volume} \times 1.2) + (100 - \text{Dispersion}) \times 0.4\right)\right)$$

---

### Macroeconomic Indicators & Data Sources

| Indicator | Value | Official Source | Reference Selector / Document |
|---|---|---|---|
| **US Dollar Index (DXY)** | `101.230` | [TradingView TVC:DXY](https://www.tradingview.com/symbols/TVC-DXY/) | `data-qa-id="symbol-last-value"` |
| **US 10-Year Bond Yield** | `5,124%` | [Investing.com FR](https://fr.investing.com/rates-bonds/u.s.-10-year-bond-yield) | `data-test="instrument-price-last"` |
| **Central Bank Purchases** | `1,045 tonnes (2024)` | [ConvertirOr.fr](https://convertiror.fr/analyses/banques-centrales-achats-or) | Analysis *« La grande accumulation »* |
| **BRICS+ Reserve Share** | `> 60% of net buys` | World Gold Council / ConvertirOr | Forecast 800–1,000 t/year through 2027 |

---

### Security & DevSecOps

DevSecOps best practices are integrated directly into the engineering lifecycle:
- **Zero Client-Side Secrets:** API keys and credential-bearing endpoints are strictly confined to backend proxies.
- **Sanitized RSS Streams:** Strict regex sanitization cleans all incoming HTML/XML tags and blocks cross-site scripting (XSS).
- **Strict TypeScript Validation:** Zero implicit `any`, no untyped objects (`npm run lint`).
- **Safe Outbound Navigation:** All external hyperlinks specify `rel="noopener noreferrer"`.
- **Graceful Fallback Handling:** If external feeds time out, certified fallback market models maintain user experience continuity.

---

### Available Scripts

- `npm run dev`: Starts the local development server on port 3000.
- `npm run build`: Compiles the TypeScript code and bundles production assets via Vite.
- `npm run lint`: Runs `tsc --noEmit` to validate types without generating output files.
- `npm run preview`: Locally serves the production `dist/` build.
- `npm run clean`: Cleans prior build artifacts.

---

### Contributing

Contributions are welcome! Whether you want to improve market models, optimize charting performance, or expand RSS sources, follow these steps:

#### 1. Fork & Clone
```bash
# Fork the repository on GitHub, then clone your fork:
git clone https://github.com/<your-username>/gold-ecg.git
cd gold-ecg
```

#### 2. Create a Feature Branch
Use descriptive branch naming conventions:
```bash
git checkout -b feat/add-new-rss-feed
# or
git checkout -b fix/sentiment-regex-parser
```

#### 3. Development Guidelines
- **Code Style:** TypeScript 5 strict mode, modular functional React components, Tailwind CSS utility classes.
- **Security:** Ensure all new external API calls pass through server proxies in `vite.config.ts`. Never commit secrets or API keys.
- **Testing & Verification:** Run linting and compile the app before submitting:
  ```bash
  npm run lint
  npm run build
  ```

#### 4. Conventional Commits
Please use clear, conventional commit messages:
- `feat: add Swiss National Bank reserve tracking`
- `fix: correct regex handling for encoded XML characters`
- `docs: update API proxy endpoint specification`
- `refactor: optimize SVG render loop in GoldPriceWidget`

#### 5. Submit a Pull Request
1. Push your branch: `git push origin feat/your-feature-name`
2. Open a Pull Request on GitHub against the `main` branch.
3. Provide a clear summary of your changes, screenshots if UI updates are involved, and confirmation that `npm run lint` and `npm run build` pass.

---

### License

This project is open source and distributed under the **[MIT License](LICENSE)**.

---

<br />

---

<a name="français"></a>
## 🇫🇷 Documentation en Français

### 📑 Table des Matières
- [Présentation Générale](#présentation-générale-1)
- [Fonctionnalités Principales](#fonctionnalités-principales-1)
- [Architecture Technique](#architecture-technique-1)
- [Arborescence du Projet](#arborescence-du-projet-1)
- [Endpoints & Proxies API Intégrés](#endpoints--proxies-api-intégrés-1)
- [Installation & Démarrage](#installation--démarrage-1)
- [Méthodologie du Moteur de Sentiment](#méthodologie-du-moteur-de-sentiment-1)
- [Indicateurs Macroéconomiques & Sources](#indicateurs-macroéconomiques--sources-1)
- [Sécurité & DevSecOps](#sécurité--devsecops-1)
- [Scripts Disponibles](#scripts-disponibles-1)
- [Contribution](#contribution-au-projet)
- [Licence](#licence-1)

---

### Présentation Générale

**Gold ECG** est une suite analytique financière dédiée au marché de l'or physique et papier. L'application fusionne deux composantes critiques pour les investisseurs et analystes :
1. **La cotation en direct du cours spot (XAU) :** Flux temps réel tick-par-tick institutionnel avec graphiques TradingView intégrés (norme GoldAPI.io) et graphes vectoriels SVG de haute précision.
2. **L'analyse quantitative de sentiment RSS :** Un moteur sémantique NLP spécialisé qui ingère, nettoie et pondère en continu les dépêches de la presse financière francophone (ABC Bourse, TradingSat, Agefi, Le Monde, Le Figaro, Les Echos) pour générer un score de sentiment consolidé et un indice de confiance statistique.

---

### Fonctionnalités Principales

#### 1. Ticker & Graphique Or Spot Haute Définition
- **Double moteur graphique :**
  - **GoldAPI Pro (TradingView) :** Intégration de l'interface graphique institutionnelle sur le flux interbancaire officiel (`FOREXCOM:XAUUSD`, `FOREXCOM:XAUEUR`, etc.) avec sélection de plages (1D, 5D, 1M, 1Y, ALL) et affichage des volumes.
  - **Moteur Vectoriel SVG :** Courbe de prix interactive ultra-légère avec ligne de mire du cours réel, points d'inflexion cliquables et bornes min/moy/max.
- **Cotations multi-devises :** USD ($), EUR (€), GBP (£), CHF (Fr).
- **Unités de poids internationales :** Once Troy (oz), Gramme (g), Kilogramme (kg).
- **Indicateurs d'exécution de marché :** Cours Spot direct, variation 24h (absolue et %), matrice Achat (Bid) / Vente (Ask) / Spread, et curseur de progression du range 24h.

#### 2. Jauge de Sentiment Consolidée (Baromètre RSS)
- **Score de -100 (Vente Forte / Bearish) à +100 (Achat Fort / Bullish).**
- **Jauge tachymétrique animée :** Aiguille pivotante SVG synchronisée sur le score moyen pondéré.
- **Indice de confiance calculé dynamiquement** selon le volume d'articles analysés, la récence et le niveau d'accord entre rédactions.
- **Répartition multi-segments :** Pourcentages et comptages précis des dépêches haussières, neutres et baissières.
- **Extraction des facteurs dominants :** Détection automatique des mots-clés à l'origine du mouvement.

#### 3. Flux d'Actualités & Dépêches Financières en Continu
- **Agrégation multi-flux francophones :** ABC Bourse, TradingSat, Agefi (Matières 1ères & Économie), Le Figaro Bourse, France Bourse, Le Monde Économie, Les Echos.
- **Filtrage interactif :** Recherche par mot-clé, sélection par polarité (Tous, Haussiers, Neutres, Baissiers) et activation/désactivation granulaire des flux sources.
- **Tags de sentiment et score par dépêche :** Chaque article affiche ses mots-clés détectés et sa contribution au score global.

#### 4. Indicateurs Macroéconomiques & Catalyseurs Certifiés
- **Indice Dollar Américain (DXY) :** Synchronisé sur le cours TradingView (`TVC:DXY` à `101.230`).
- **Rendements obligataires réels US 10 ans :** Taux de référence Investing.com FR (`5,124%`).
- **Achats nets des Banques Centrales :** Données chiffrées ConvertirOr.fr / World Gold Council (**1 045 tonnes en 2024**, détails Chine, Pologne, Turquie, Inde).
- **Dédollarisation BRICS+ :** Plus de 60 % des achats officiels nets mondiaux.

#### 5. Simulateur de Titres Financiers
- Outil d'expérimentation permettant de tester des titres hypothétiques pour observer en temps réel la réaction de l'algorithme d'analyse sémantique.

---

### Architecture Technique

| Composant | Technologie / Standard | Rôle |
|---|---|---|
| **Frontend Framework** | **React 19** (TypeScript) | Composants fonctionnels réactifs, hooks personnalisés |
| **Styling & Design** | **Tailwind CSS v4** | Thème sombre financier (Slate / Amber / Emerald / Rose) |
| **Bundler & Serveur** | **Vite 8** | Compilation rapide, modules ESM natifs |
| **Proxies d'API** | **Middlewares Vite / Express** | Contournement CORS, nettoyage XML/RSS, formatage JSON |
| **Flux Graphiques** | **TradingView Symbol Overview** | Rendu temps réel via `embed-widget-symbol-overview.js` |
| **Sécurité** | **DevSecOps Standard** | Zéro clé API exposée, assainissement regex anti-XSS |

---

### Arborescence du Projet

```text
├── index.html                  # Point d'entrée HTML et métadonnées OpenGraph
├── metadata.json               # Métadonnées d'application et déclarations de capacités
├── package.json                # Dépendances npm et scripts de build
├── tsconfig.json               # Configuration du compilateur TypeScript
├── vite.config.ts              # Configuration Vite & Middlewares API Proxy intégrés
├── src/
│   ├── main.tsx                # Point de montage ReactDOM
│   ├── App.tsx                 # Composant racine, routage d'onglets et orchestration
│   ├── index.css               # Imports globaux et directives Tailwind CSS v4
│   ├── components/
│   │   ├── Header.tsx                 # Barre de navigation, horloges Paris/NY et actions
│   │   ├── GoldPriceWidget.tsx        # Widget principal du cours spot, métriques et sélecteurs
│   │   ├── GoldApiTradingViewWidget.tsx # Intégration TradingView (spécification GoldAPI.io)
│   │   ├── SentimentGauge.tsx         # Jauge de sentiment semi-circulaire et métriques de confiance
│   │   ├── HeadlineStream.tsx         # Flux de dépêches avec filtrage et gestion des sources
│   │   ├── MarketEconomics.tsx        # Dashboard des catalyseurs macro (DXY, US10Y, Banques Centrales)
│   │   └── HeadlineSimulator.tsx      # Banc d'essai interactif pour tester l'analyseur NLP
│   ├── services/
│   │   ├── goldPriceService.ts        # Conversions de devises/poids et calculs de spreads
│   │   ├── rssService.ts              # Connecteurs vers les flux RSS via proxy et parsers XML
│   │   └── sentimentEngine.ts         # Moteur lexical financier, scoring et calcul de confiance
│   └── types/
│       └── index.ts                   # Définitions des interfaces TypeScript (GoldData, Feeds, etc.)
```

---

### Endpoints & Proxies API Intégrés

Afin d'éviter tout blocage de politique CORS côté navigateur et de garantir la continuité de service, le serveur Vite intègre des routes proxy spécialisées :

- **`GET /api/gold-price`** : Récupère le cours spot de l'or en temps réel depuis le flux officiel `goldprice.org`.
- **`GET /api/goldapi-quote`** : Fournit un objet de cotation complet respectant les spécifications de l'API standard `GoldAPI.io`.
- **`GET /api/rss-feeds`** : Interroge en parallèle les serveurs de presse financière, nettoie le balisage CDATA/HTML et renvoie un flux unifié de dépêches.

---

### Installation & Démarrage

#### Prérequis
- **Node.js** v18.0.0 ou supérieur
- **npm** (inclus avec Node) ou **pnpm** / **yarn**

#### 1. Cloner le dépôt
```bash
git clone https://github.com/votre-compte/gold-ecg.git
cd gold-ecg
```

#### 2. Installer les dépendances
```bash
npm install
```

#### 3. Lancer l'environnement de développement
```bash
npm run dev
```
L'application démarre par défaut sur `http://localhost:3000`.

#### 4. Compiler pour la production
```bash
npm run build
```
Les fichiers statiques optimisés seront générés dans le dossier `dist/`.

---

### Méthodologie du Moteur de Sentiment

Le moteur `src/services/sentimentEngine.ts` évalue chaque dépêche à l'aide d'un dictionnaire financier français contextualisé :

1. **Pondérations lexicales haussières (+1 à +3) :**
   - *Baisse des taux, détente monétaire, achats banques centrales, demande physique, valeur refuge, record historique, tensions géopolitiques, envolée, rallye, accumulation.*
2. **Pondérations lexicales baissières (-1 à -3) :**
   - *Hausse des taux, dollar fort, resserrement monétaire, prises de bénéfices, décollecte ETF, repli, consolidation baissière, désescalade, ventes massives.*
3. **Calcul de l'Indice de Confiance :**
   $$\text{Confiance} = \min\left(95, \max\left(35, (\text{Volume} \times 1.2) + (100 - \text{Dispersion}) \times 0.4\right)\right)$$
   L'indice récompense le volume de données et le consensus entre sources distinctes.

---

### Indicateurs Macroéconomiques & Sources

L'onglet **Macro** s'appuie sur des données de référence documentées et traçables :

| Indicateur | Cotation / Donnée | Source Officielle | Référence Balise / Document |
|---|---|---|---|
| **Dollar Index (DXY)** | `101.230` | [TradingView TVC:DXY](https://www.tradingview.com/symbols/TVC-DXY/) | `data-qa-id="symbol-last-value"` |
| **Obligations US 10 Ans** | `5,124%` | [Investing.com FR](https://fr.investing.com/rates-bonds/u.s.-10-year-bond-yield) | `data-test="instrument-price-last"` |
| **Achats Banques Centrales** | `1 045 tonnes (2024)` | [ConvertirOr.fr](https://convertiror.fr/analyses/banques-centrales-achats-or) | Analyse *« La grande accumulation »* |
| **Dynamique BRICS+** | `> 60% des achats` | World Gold Council / ConvertirOr | Prévision WGC 800–1 000 t/an (2025-2027) |

---

### Sécurité & DevSecOps

Conformément aux principes **DevSecOps**, la sécurité est intégrée à chaque étape du cycle de vie logiciel :

- **Aucun secret exposé côté client :** Tous les flux externes transitent par des proxies backend ou des widgets encapsulés.
- **Sanitisation stricte des flux RSS :** Nettoyage systématique des balises HTML, entités XML non sécurisées et injections potentielles via regex stricte.
- **Validation TypeScript intégrale :** Typage fort interdisant les valeurs non contrôlées (`npm run lint`).
- **Liens sortants sécurisés :** Tous les liens hypertextes externes comportent `rel="noopener noreferrer"`.
- **Résilience réseau (Graceful Degradation) :** En cas d'indisponibilité momentanée des flux distants, des données de repli cohérentes avec les cours du marché 2026 sont automatiquement substituées sans bloquer l'interface.

---

### Scripts Disponibles

Dans le répertoire du projet, vous pouvez exécuter :

- `npm run dev` : Démarre le serveur de développement local sur le port 3000.
- `npm run build` : Compile et optimise l'application pour le déploiement en production.
- `npm run lint` : Exécute le linter TypeScript (`tsc --noEmit`) pour vérifier la validité du code.
- `npm run preview` : Prévisualise localement le build de production.
- `npm run clean` : Nettoie les artefacts de build précédents.

---

### Contribution au Projet

Les contributions sont les bienvenues ! Pour soumettre une amélioration, un correctif ou une nouvelle source de données :

#### 1. Forker le Dépôt
Cliquez sur le bouton **Fork** en haut à droite sur GitHub, puis clonez votre copie locale :
```bash
git clone https://github.com/<votre-pseudo>/gold-ecg.git
cd gold-ecg
```

#### 2. Créer une Branche Dédiée
Respectez la convention de nommage des branches :
```bash
git checkout -b feat/ajout-flux-suisse
# ou
git checkout -b fix/regex-analyse-sentiment
```

#### 3. Règles de Développement
- **TypeScript strict :** Aucun `any` implicite, interfaces complètes pour les nouvelles données.
- **Sécurité :** Tout nouvel appel à une API externe doit être routé via un proxy backend (`vite.config.ts`). Ne jamais commiter de token ou clé privée.
- **Vérification automatique :**
  ```bash
  npm run lint
  npm run build
  ```

#### 4. Format des Commits Conventionnels
Adoptez les préfixes standards pour faciliter le changelog automatique :
- `feat: intégration du flux RSS Les Echos Marchés`
- `fix: correction du calcul de spread sur les cotations CHF`
- `docs: enrichissement du guide de contribution`
- `perf: mémoïsation du calcul de sentiment agrégé`

#### 5. Soumettre une Pull Request
1. Poussez votre branche : `git push origin feat/votre-fonctionnalite`
2. Ouvrez une Pull Request vers la branche `main`.
3. Décrivez précisément l'objectif du changement et vérifiez que les étapes de compilation sont au vert.

---

### Licence

Ce projet est distribué sous licence libre **[MIT](LICENSE)**. Vous êtes libre de l'utiliser, de le modifier et de l'adapter selon vos besoins financiers ou personnels.
