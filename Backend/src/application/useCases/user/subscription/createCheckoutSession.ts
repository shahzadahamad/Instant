import { ISubscription } from "../../../../infrastructure/database/models/subscription";
import UserRepository from "../../../repositories/user/userRepository";
import SubscriptionRepository from "../../../repositories/admin/subscriptionRepository";
import { stripe } from "../../../../infrastructure/configs/stripe";

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

    if (user.isVerified.status) {
      throw new Error("user already verified");
    }

    const subscription = await this.subscriptionRepository.findSubcriptionById(plan._id);

    if (!subscription) {
      throw new Error("subscription not found!");
    }

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
      customer_email: user.email,
      allow_promotion_codes: true,
      mode: 'payment',
      metadata: {
        userId: user._id.toString(),
        plan: JSON.stringify(plan),
      },
      success_url: process.env.SUCCESS_URL!,
      cancel_url: process.env.CANCEL_URL!
    });

    return session.id;

  }
}
