# Contributing to Suvidha Inventory

## Project Overview

Suvidha Inventory is a full-stack application designed to help manage inventory. It consists of a React frontend and a Node.js backend.

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/en/) (v20.x or later)
*   [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/anuragborkar2005/suvidha_inventory.git
    cd suvidha-inventory
    ```

2.  **Install backend dependencies:**

    ```bash
    cd backend
    npm install
    ```

3.  **Install frontend dependencies:**

    ```bash
    cd ../frontend
    npm install
    ```

## Development Workflow

### Running the Backend

1.  Navigate to the `backend` directory:

    ```bash
    cd backend
    ```

2.  Build the backend code:

    ```bash
    npm run build
    ```

3.  Start the development server:

    ```bash
    npm run dev
    ```

    The backend will be running on `http://localhost:3000` (or the port specified in your `.env` file).

### Running the Frontend

1.  Navigate to the `frontend` directory:

    ```bash
    cd frontend
    ```

2.  Start the development server:

    ```bash
    npm run dev
    ```

    The frontend will be running on `http://localhost:3001` (or the port specified by Next.js).

### Running Tests

_NOTE: Test scripts are not yet defined in `package.json`. Please add them and document them here._

### Linting

To check the code for any linting errors, run the following commands from their respective directories:

*   **Backend:** `npm run lint` (You'll need to add a `lint` script to `backend/package.json`)
*   **Frontend:** `npm run lint`

## Pull Request Process

1.  Ensure any install or build dependencies are removed before the end of the layer when doing a build.
2.  Update the `README.md` with details of changes to the interface, this includes new environment variables, exposed ports, useful file locations and container parameters.
3.  Increase the version numbers in any examples and the `README.md` to the new version that this Pull Request would represent. The versioning scheme we use is [SemVer](http.semver.org/).
4.  You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

## Git Flow Guidelines

We use a simplified Git flow for our branching strategy. This helps us keep the repository clean and makes it easier to track changes.

### `main` branch

The `main` branch is our stable branch. It should always be in a state that is ready for production. All pull requests to `main` must be reviewed and approved by at least two other developers.

### `develop` branch

The `develop` branch is our main development branch. All new features and bug fixes should be based on this branch. When a feature is complete, it is merged back into `develop`.

### `feature` branches

For new features, create a `feature` branch from the `develop` branch. The naming convention for feature branches is `feature/<feature-name>`. For example:

```bash
git checkout develop
git checkout -b feature/add-user-authentication
```

When the feature is complete, create a pull request to merge it into the `develop` branch.

### `release` branches

When the `develop` branch is ready for a new release, a `release` branch is created from `develop`. The naming convention for release branches is `release/<version-number>`. For example:

```bash
git checkout develop
git checkout -b release/1.0.0
```

No new features should be added to the release branch. Only bug fixes and documentation changes are allowed. Once the release is ready, it is merged into both the `main` and `develop` branches.

### `hotfix` branches

If a critical bug is found in production, a `hotfix` branch is created from the `main` branch. The naming convention for hotfix branches is `hotfix/<bug-name>`. For example:

```bash
git checkout main
git checkout -b hotfix/fix-login-bug
```

Once the hotfix is complete, it is merged into both the `main` and `develop` branches.

