export const server = "http://localhost:8000/api/v2";

// export const backend_url = "http://localhost:8000/";

export const backend_url = process.env.NODE_ENV === 'production'
    ? 'https://dp-backend-neocreatyve-gmailcoms-projects.vercel.app'  // Backend Vercel URL
    : 'http://localhost:8000/';

// const api = axios.create({
//     baseURL: backend_url,
//     withCredentials: true
// }); 
 