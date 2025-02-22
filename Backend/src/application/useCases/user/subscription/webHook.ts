import PaymentRepository from "../../../repositories/user/paymentRepository";
import UserRepository from "../../../repositories/user/userRepository";
import Stripe from "stripe";

export default class WebHook {
  private userRepository: UserRepository;
  private paymentRepository: PaymentRepository;

  constructor(userRepository: UserRepository, paymentRepository: PaymentRepository) {
    this.userRepository = userRepository;
    this.paymentRepository = paymentRepository;
  }

  public async execute(event: Stripe.Event): Promise<void> {
    if (event) {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object;
          if (session.metadata) {
            const metadata = session.metadata;
            const parsedPlan = JSON.parse(metadata.plan);
            const user = await this.userRepository.findById(metadata.userId);
            if (user && parsedPlan) {
              const paymentData = {
                userId: user._id.toString(),
                transactionId: session.payment_intent!.toString(),
                amount: session.amount_total! / 100,
                currency: session.currency!,
                status: 'success',
              };
              const newPayment = await this.paymentRepository.createPayment(paymentData);
              await this.userRepository.updateVerification(paymentData.userId, parsedPlan.period, true, newPayment._id.toString());
            }
          }
          break;
        }
      }
    }
  }
}
