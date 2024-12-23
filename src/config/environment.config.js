import dotenv from "dotenv";

dotenv.config();

const ENVIRONMENT = {
  PORT: process.env.PORT || 3000,
  MONGO_DB_CONNECTION_STR: process.env.MONGO_DB_CONNECTION_STR,
  MONGO_DB_DATABASE: process.env.MONGO_DB_DATABASE,
  SECRET_KEY: process.env.SECRET_KEY,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  FRONTEND_URL: process.env.FRONTEND_URL,
};

export default ENVIRONMENT;
