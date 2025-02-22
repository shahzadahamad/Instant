import dotenv from "dotenv";
import Stripe from "stripe";
dotenv.config();

export const stripe = new Stripe(process.env.STRIPE_API_KEY!);
