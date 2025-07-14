This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- User authentication (signup/login)
- Secure API integration with API key authentication
- Form validation and error handling
- Responsive UI components

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Backend API server running on port 8000

### Environment Configuration

Create a `.env` file in the root directory with the following configuration:

```bash
# API Security Configuration
API_KEY=your-secure-api-key-here
```

**Important:** Replace `your-secure-api-key-here` with the actual API key provided by your backend authentication server.

### Installation and Setup

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Configure your environment variables in the `.env` file (see above)

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Authentication

This application uses API key authentication to secure communication with the backend user management server. The API key is:

- Stored securely in environment variables
- Sent as an `X-API-Key` header with all API requests
- Required for all authentication operations (signup, login)

### Security Notes

- Never commit your `.env` file to version control
- Use different API keys for development and production environments
- Ensure your backend server validates the API key for all requests

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
