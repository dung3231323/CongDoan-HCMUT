export const config = {
  api: {
    url: import.meta.env.VITE_API_URL ?? 'http://localhost:4000',
  },
  client: {
    url: import.meta.env.VITE_CLIENT_URL ?? 'http://localhost:3000',
  },
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  },
};
