# Notemy

Notemy is a modern note-taking application built with Next.js, featuring secure authentication and a responsive design.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: version 20 or higher.
- **Git**: version 2.x or higher.
- **Docker** (optional): for containerized deployment.

## Environment Variables

Copy the example environment file to create your local configuration:

```bash
cp example.env .env
```

Open `.env` and configure the following variables:

- `BETTER_AUTH_SECRET`: Secret key for authentication (generate using `npx auth secret`).
- `BETTER_AUTH_URL`: Base URL of your app (e.g., `http://localhost:3000`).
- `GITHUB_CLIENT_ID`: GitHub OAuth Client ID.
- `GITHUB_CLIENT_SECRET`: GitHub OAuth Client Secret.
- `DATABASE_URL`: Connection string for your PostgreSQL database.
- `NEXT_PUBLIC_SECURE_LOCAL_STORAGE_HASH_KEY`: Secret key for secure local storage.
- `NEXT_PUBLIC_SECURE_LOCAL_STORAGE_PREFIX`: Prefix for local storage keys (e.g., `notemy_`).

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd notemy
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

## Running Locally

To start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

To start the production server:

```bash
npm run start
# or
yarn start
# or
pnpm start
```

## Docker Deployment

This project includes a `Dockerfile` optimized for production using `output: "standalone"` in Next.js.

### 1. Build the Docker Image

Run the following command in the root directory:

```bash
docker build -t notemy .
```

### 2. Run the Docker Container

Start the container, mapping port 3000 and passing your environment variables:

```bash
docker run -d -p 3000:3000 --env-file .env --name notemy-container notemy
```

Your application should now be running at [http://localhost:3000](http://localhost:3000).
