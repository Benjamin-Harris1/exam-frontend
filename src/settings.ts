if (!import.meta.env.VITE_DEV_API_BASE_URL) {
  console.info("--> Add API-URL TO .env file");
}

const URL = import.meta.env.VITE_DEV_API_BASE_URL;

console.info("Development API URL: " + URL);
// console.info("ENV", import.meta.env);
export const API_URL = URL;