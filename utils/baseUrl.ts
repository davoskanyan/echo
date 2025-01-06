const vercelUrl = process.env.VERCEL_URL;

export const baseUrl = vercelUrl
  ? `https://${vercelUrl}`
  : 'http://localhost:3000';
