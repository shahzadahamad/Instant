import FriendsRepository from "../../../repositories/user/friendsRepository";
import PaymentRepository from "../../../repositories/user/paymentRepository";
import PostRepository from "../../../repositories/user/postRepository";
import UserRepository from "../../../repositories/user/userRepository";

export default class GetDashboardData {
  private postRepository: PostRepository;
  private userRepository: UserRepository;
  private friendsRepository: FriendsRepository;
  private paymentRepository: PaymentRepository;

  constructor(
    postRepository: PostRepository,
    userRepository: UserRepository,
    friendsRepository: FriendsRepository,
    paymentRepository: PaymentRepository
  ) {
    this.postRepository = postRepository;
    this.userRepository = userRepository;
    this.friendsRepository = friendsRepository;
    this.paymentRepository = paymentRepository;
  }

  public async execute(): Promise<{
    totalRevenue: number;
    monthlyRevenue: { name: string; value: number }[];
    percentageIncrease: number;
    totalUser: number,
    totalPost: number,
    totalActiveUsers: number,
    topFollowedUsers: { followersCount: number }[],
  }> {

    const payments = await this.paymentRepository.getAllPayments();
    const users = await this.userRepository.getAllUsers();
    const totalPost = await this.postRepository.getAllPostCount();
    const friends = await this.friendsRepository.getAllFriends();

    const totalActiveUsers = users.filter(user => user.isOnline?.status).length;

    // Calculate total revenue
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);

    // Initialize monthly revenue map
    const monthlyRevenueMap: { [key: string]: number } = {
      Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0,
      Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0,
    };

    // Populate monthly revenue
    payments.forEach((payment) => {
      const month = new Date(payment.createdAt).toLocaleString('en-US', { month: 'short' });
      if (monthlyRevenueMap[month] !== undefined) {
        monthlyRevenueMap[month] += payment.amount;
      }
    });

    // Convert monthly revenue object to array
    const monthlyRevenue = Object.keys(monthlyRevenueMap).map((month) => ({
      name: month,
      value: monthlyRevenueMap[month],
    }));

    // Get current and previous month revenue
    const currentMonth = new Date().toLocaleString('en-US', { month: 'short' });
    const previousMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleString('en-US', { month: 'short' });

    const currentMonthRevenue = monthlyRevenueMap[currentMonth] || 0;
    const previousMonthRevenue = monthlyRevenueMap[previousMonth] || 0;

    // Calculate percentage increase
    let percentageIncrease = 0;

    if (previousMonthRevenue === 0) {
      percentageIncrease = currentMonthRevenue > 0 ? 100 : 0;
    } else {
      percentageIncrease = ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;
    }

    const topUserIds = friends
      .map(friend => ({
        userId: friend.userId,
        followersCount: friend.followers.length
      }))
      .sort((a, b) => b.followersCount - a.followersCount)
      .slice(0, 10)
      .map(user => user.userId);

    // Fetch user details for these top 10 users
    const topUsersDetails = await this.userRepository.findUsersByUserIds(topUserIds);

    // Map user details to the followers count
    const topFollowedUsers = topUsersDetails.map(user => ({
      ...user.toObject(),
      followersCount: friends.find(friend => friend.userId === user.id)?.followers.length || 0
    })).sort((a, b) => b.followersCount - a.followersCount);

    return {
      totalRevenue,
      percentageIncrease: parseFloat(percentageIncrease.toFixed(2)),
      monthlyRevenue,
      totalUser: users.length,
      totalPost,
      totalActiveUsers,
      topFollowedUsers,
    };
  }
}

