# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

gcloud run deploy vote-mate \
 --image gcr.io/vote-mate/gcr.io/vote-mate/sveltekit-app:latest \
 --platform managed \
 --region europe-west1 \
 --set-env-vars PORT=3000 \
 --allow-unauthenticated

1. To download current schema:
   - `bq show --schema --format=prettyjson vote_mate_responses.public_responses > public_responses_schema.json`
2. To upload updated schema:
   - `bq update vote_mate_responses.public_responses public_responses_schema.json`
3. Delete single Column through Query
   - `ALTER TABLE mydataset.mytable DROP COLUMN IF EXISTS myColumn`
