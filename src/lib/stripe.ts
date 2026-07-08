import Stripe from "stripe";
import config from "../config";

if (!config.stripe_secret_key) {
  throw new Error("STRIPE_SECRET_KEY is not defined");
}

export const stripe = new Stripe(config.stripe_secret_key, {
  apiVersion: "2026-06-24.dahlia",
});
