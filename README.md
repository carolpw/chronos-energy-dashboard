# Energy Forecasting Dashboard

A real-time energy and water temperature forecasting dashboard combining **machine learning, cloud, and frontend visualization**.

## 🚀 Project Overview
- Developed a full-stack forecasting dashboard to explore the intersection of **energy management** and **machine learning**.
- Implemented **time series forecasting** with [Amazon Chronos](https://huggingface.co/amazon/chronos-bolt-base) using Python.
- Built a **FastAPI backend** deployed on **AWS Lambda** (via Mangum) for scalable, serverless ML inference.
- Designed a modern **React + TypeScript frontend**, deployed globally on **Cloudflare**.
- Containerized services with **Docker** for reproducible development and deployment.

## 🔑 Features
- Forecasting of short-term temperature/energy demand using **Chronos Bolt** model.
- **Interactive charts** with past data, predicted values, and real-time reference indicators.
- Fully **serverless architecture**: API on AWS Lambda + frontend on Cloudflare.
- Data alignment logic ensuring accurate timestamps and confidence intervals.

## 🛠️ Tech Stack
- **Backend:** Python, FastAPI, HuggingFace, Pandas, AWS Lambda, Mangum
- **Frontend:** React, TypeScript, Vite, Recharts
- **Infra & DevOps:** Cloudflare, Docker, GitHub
- **ML:** Amazon Chronos (Bolt)

## 📌 Why this project?
This project showcases my interest in **energy forecasting, applied ML, cloud/serverless deployment, and modern frontend development**.



# Welcome to Remix + Cloudflare Workers!

- 📖 [Remix docs](https://remix.run/docs)
- 📖 [Remix Cloudflare docs](https://remix.run/guides/vite#cloudflare)

## Development

Run the dev server:

```sh
npm run dev
```

To run Wrangler:

```sh
npm run build
npm start
```

## Typegen

Generate types for your Cloudflare bindings in `wrangler.toml`:

```sh
npm run typegen
```

You will need to rerun typegen whenever you make changes to `wrangler.toml`.

## Deployment

If you don't already have an account, then [create a cloudflare account here](https://dash.cloudflare.com/sign-up) and after verifying your email address with Cloudflare, go to your dashboard and set up your free custom Cloudflare Workers subdomain.

Once that's done, you should be able to deploy your app:

```sh
npm run deploy
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.
