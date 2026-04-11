# API Test Automation Framework

[![CI](https://github.com/maksimTrs/api-ts-framework/actions/workflows/ci.yml/badge.svg)](https://github.com/maksimTrs/api-ts-framework/actions/workflows/ci.yml)
[![Test Report](https://img.shields.io/badge/Test_Report-GitHub_Pages-blue?logo=github)](https://maksimtrs.github.io/api-ts-framework/)

Production-grade API test automation framework built with **Jest 30 + SuperTest + TypeScript**.
Designed as a reference architecture for SDET teams — clean layering, strict types, CI/CD integration, and Docker support out of the box.

**Target API:** [SDet Unicorns Practice API](https://www.practice-react.sdetunicorns.com/test/api-docs/)

---

## Tech Stack

| Tool | Role |
|---|---|
| **TypeScript 5** | Language — strict mode, path aliases, typed API contracts |
| **Jest 30** | Test runner — assertions, lifecycle, parallel workers, coverage |
| **SuperTest 7** | HTTP client — fluent API for sending requests and checking responses |
| **ts-jest** | Transpiler — compiles `.ts` in memory, no build step needed |
| **Faker.js** | Test data — realistic payloads via factory functions |
| **ESLint 10** | Static analysis — flat config with TypeScript + Jest rules |
| **Husky + lint-staged** | Git hooks — lint on pre-commit |
| **Docker** | Containerized execution — single command to run all tests |
| **GitHub Actions** | CI/CD — lint, test, report deployment |

---

## Features

- **Layered architecture** — tests, API clients, models, factories, schemas, helpers — each layer has a single responsibility
- **Typed API contracts** — `interface` for every request body, response, list item, and error shape
- **Factory functions** — generate test data with Faker, accept `Partial<T>` overrides for variations
- **Schema validation** — dedicated `*.schema.spec.ts` files verify exact response structure via asymmetric matchers
- **Global assertion guard** — `expect.hasAssertions()` in every test automatically (catches forgotten `await`)
- **Path aliases** — clean imports: `@clients/*`, `@models/*`, `@data/*`, `@schemas/*`, `@helpers/*`
- **Three reporters** — console output + JUnit XML (CI integration) + interactive HTML dashboard
- **GitHub Pages** — HTML test report auto-deployed on every push to `main`
- **Docker support** — `docker compose up` runs the full suite with reports mounted to host
- **Pre-commit hooks** — Husky + lint-staged block unlinted code from reaching the repo

---

## Project Structure

```
tests/
├── api/                        # Test specs — one file per resource
│   └── sdetunicorns/
│       ├── brands/
│       │   ├── brands.spec.ts
│       │   └── brands.schema.spec.ts
│       └── categories/
│           ├── categories.spec.ts
│           └── categories.schema.spec.ts
├── clients/                    # API clients — SuperTest wrappers per resource
│   ├── authClient.ts
│   ├── brandClient.ts
│   └── categoryClient.ts
├── data/                       # Factories — test data generation
│   ├── brandFactory.ts
│   └── categoryFactory.ts
├── helpers/                    # Utilities — env config, shared functions
│   └── envConfig.ts
├── models/                     # Interfaces — request/response type contracts
│   ├── auth.ts
│   ├── brand.ts
│   └── category.ts
├── schemas/                    # Schema templates — reusable assertion objects
│   ├── brandSchemas.ts
│   └── categorySchemas.ts
└── setup/                      # Global hooks — lifecycle, custom matchers
    └── globalHooks.ts
```

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Test Specs                        │
│         brands.spec.ts  categories.spec.ts          │
│                                                     │
│  Arrange: factories + clients                       │
│  Act:     client.get() / client.post()              │
│  Assert:  Jest expect() on typed response           │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│                  API Clients                         │
│       BrandClient  CategoryClient  AuthClient        │
│                                                     │
│  SuperTest wrapper per resource                     │
│  Typed methods: get(), post(body), delete(id)       │
│  Auth injection via Bearer token                    │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│              Supporting Layers                       │
│                                                     │
│  Models      — TypeScript interfaces (contracts)    │
│  Factories   — Faker-based payload generators       │
│  Schemas     — Asymmetric matcher templates         │
│  Helpers     — Environment config, utilities        │
└─────────────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+

### Installation

```bash
git clone https://github.com/maksimTrs/api-ts-framework.git
cd api-ts-framework
npm ci
```

### Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with valid credentials:

```env
BASE_URL=https://www.practice-react.sdetunicorns.com/api/test
EMAIL=your-email@example.com
PASSWORD=your-password-here
```

---

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npx jest tests/api/sdetunicorns/brands/brands.spec.ts

# Run tests matching a file path pattern
npx jest --testPathPatterns="brands"

# Run tests matching a name pattern
npx jest --testNamePattern="GET /brands"

# Watch mode — re-run on file changes
npm run test:watch

# Sequential execution (debug-friendly)
npx jest --runInBand

# Coverage report
npm run test:coverage
```

### Linting

```bash
# Check for issues
npm run lint

# Auto-fix
npm run lint:fix
```

---

## Docker

Run the full test suite in a container with a single command:

```bash
docker compose up --build
```

- Reads credentials from `.env` on the host
- Mounts `./reports/` — test artifacts are available after the run
- Uses `node:22-slim` image with optimized layer caching

---

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push to `main` and on pull requests:

```
push / PR to main
       │
       ├── lint          → ESLint static analysis
       │
       └── test          → Full test suite against live API
              │
              ├── JUnit XML report  → GitHub Checks tab
              ├── HTML report       → Uploaded as artifact (14-day retention)
              │
              └── deploy-report     → Published to GitHub Pages (main branch only)
```

| Job | Runs on | What it does |
|---|---|---|
| **lint** | Every commit | `npm run lint` — catches code issues before tests |
| **test** | Every commit | `npm test` — full test suite against live API |
| **deploy-report** | main only | Deploys HTML dashboard to [GitHub Pages](https://maksimtrs.github.io/api-ts-framework/) |

---

## Test Reports

- **Console** — verbose output with each test listed separately
- **JUnit XML** — `reports/junit.xml` — integrated into GitHub Actions Checks tab via [action-junit-report](https://github.com/mikepenz/action-junit-report)
- **HTML Dashboard** — interactive report auto-deployed to GitHub Pages after every CI run

---

