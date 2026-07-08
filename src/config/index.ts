import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env"), quiet: true });

const bcryptSaltRounds = Number.parseInt(
  process.env.BCRYPT_SALT_ROUNDS ?? "10",
  10,
);

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  app_url: (() => {
    const value = process.env.APP_URL;
    if (!value) {
      throw new Error("Missing required environment variable: APP_URL");
    }
    try {
      const url = new URL(value);
      return url.toString().replace(/\/$/, "");
    } catch {
      throw new Error(
        "Invalid environment variable APP_URL: must be a valid absolute URL with scheme",
      );
    }
  })(),
  bcrypt_salt_rounds: Number.isNaN(bcryptSaltRounds) ? 10 : bcryptSaltRounds,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET!,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET!,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN!,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN!,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  stripe_currency: (() => {
    const value = process.env.STRIPE_CURRENCY;
    if (!value) {
      throw new Error("Missing required environment variable: STRIPE_CURRENCY");
    }
    return value;
  })(),
};
