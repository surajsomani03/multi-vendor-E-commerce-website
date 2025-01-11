export const server = process.env.NODE_ENV === 'production'
    ? "https://dp-backend-neocreatyve-gmailcoms-projects.vercel.app/api/v2"
    : "http://localhost:8000/api/v2";

export const backend_url = process.env.NODE_ENV === 'production'
    ? "https://dp-backend-neocreatyve-gmailcoms-projects.vercel.app"
    : "http://localhost:8000";


 