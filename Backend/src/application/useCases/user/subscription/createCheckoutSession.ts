import { ISubscription } from "../../../../infrastructure/database/models/subscription";
import Stripe from 'stripe';
import UserRepository from "../../../repositories/user/userRepository";
import SubscriptionRepository from "../../../repositories/admin/subscriptionRepository";

export default class CreateCheckoutSession {
  private userRepository: UserRepository;
  private subscriptionRepository: SubscriptionRepository;

  constructor(userRepository: UserRepository, subscriptionRepository: SubscriptionRepository) {
    this.userRepository = userRepository;
    this.subscriptionRepository = subscriptionRepository;
  }

  public async execute(plan: ISubscription, userId: string) {

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error("user not found!");
    }

    const subscription = await this.subscriptionRepository.findSubcriptionById(plan._id);

    if (!subscription) {
      throw new Error("subscription not found!");
    }

    const stripe = new Stripe(process.env.STRIPE_API_KEY!);

    const subscriptionPlan = [{
      price_data: {
        currency: 'inr',
        unit_amount: Math.round(subscription.price * 100),
        product_data: {
          name: `Plan period: ${subscription.period}`,
          description: `${user.fullname} Account verification for 1 ${subscription.period === 'Monthly' ? 'month' : subscription.period === 'Yearly' && 'year'}`,
          images: [user.profilePicture],
        },
      },
      quantity: 1,
    }];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: subscriptionPlan,
      mode: 'payment',
      success_url: process.env.SUCCESS_URL!,
      cancel_url: process.env.CANCEL_URL!
    });

    return session.id;

  }
}
