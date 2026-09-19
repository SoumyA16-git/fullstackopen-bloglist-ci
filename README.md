# Full Stack Open — Part 11: Own Pipeline (Bloglist CI/CD)

This repository contains the CI/CD pipeline implementation for the Bloglist application for **Exercise 11.21 & 11.22** of Full Stack Open.

---

## 🏗️ Architecture

- **Backend**: Express + MongoDB REST API (`controllers/`, `models/`, `utils/`, `tests/`)
- **Frontend**: React + Vite + Material UI single-page application (`frontend/`)
- **Pipeline**: Automated build, test, and release workflow with GitHub Actions (`.github/workflows/pipeline.yml`)

---

## 🚀 CI/CD Workflow

1. **`build_and_test`**:
   - Checks out repository.
   - Installs Node.js 20.
   - Installs backend and frontend dependencies.
   - Runs frontend Vitest component tests (`npm test -- --run`).
   - Builds frontend production assets (`npm run build`).

2. **`deploy`**:
   - Runs on `push` to `main` without `#skip`.
   - Triggers deployment via `RENDER_DEPLOY_HOOK` secret.

3. **`tag_release`**:
   - Bumps patch version and creates git tag on successful `main` branch merges.
   - Skipped if `#skip` is present in commit message.

---

## 🔒 Branch Protection (Exercise 11.22)

The `main` branch is protected:
- Direct pushes without a pull request are prevented.
- All status checks (`build_and_test`) must pass before merging.
- Pull request review is required.

---

## 🔗 Related Repositories

- **Main Pokedex Pipeline**: [https://github.com/SoumyA16-git/fs-pokedex](https://github.com/SoumyA16-git/fs-pokedex)
- **Course Monorepo**: [https://github.com/SoumyA16-git/fullstackopen](https://github.com/SoumyA16-git/fullstackopen)
