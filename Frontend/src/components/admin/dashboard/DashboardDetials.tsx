import { getDashboardData } from '@/apis/api/adminApi';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const DashboardDetials = () => {

  const [monthlyData, setMonthlyData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalRevenuePercentage, setTotalRevenuePercentage] = useState(0);
  const [totalUser, setTotalUser] = useState(0);
  const [totalPost, setTotalPost] = useState(0);
  const [activeUsers, setActiveUser] = useState(0);
  const [popularUser, setPopularUser] = useState<{ _id: string, profilePicture: string, username: string, email: string, followersCount: number }[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getDashboardData();
        setMonthlyData(response.monthlyRevenue);
        setTotalRevenue(response.totalRevenue);
        setTotalRevenuePercentage(response.percentageIncrease);
        setTotalUser(response.totalUser);
        setTotalPost(response.totalPost);
        setActiveUser(response.totalActiveUsers);
        setPopularUser(response.topFollowedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchDashboardData()
  }, [])

  return (
    <div className="min-h-screen p-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Total Revenue</span>
            <span className="text-gray-400">₹</span>
          </div>
          <div className="text-2xl font-bold mb-1">₹{totalRevenue}</div>
          <div className={`${totalRevenuePercentage > 0 ? "text-green-500" : "text-red-500"} text-sm`}>+{totalRevenuePercentage}% from last month</div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Total Users</span>
          </div>
          <div className="text-2xl font-bold mb-1">{totalUser}</div>
          <div className="text-green-500 text-sm">+19% from last month</div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Total Posts</span>
          </div>
          <div className="text-2xl font-bold mb-1">{totalPost}</div>
          <div className="text-green-500 text-sm">+180.1% from last month</div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Active User Now</span>
          </div>
          <div className="text-2xl font-bold mb-1">{activeUsers}</div>
          <div className="text-green-500 text-sm">+201 since last hour</div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 pb-5">
        <div className="col-span-3 border rounded-lg p-4">
          <h2 className="text-lg font-bold mb-4">Overview</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Bar dataKey="value" fill="#fff" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-2 border rounded-lg p-4">
          <h2 className="text-lg font-bold mb-4">Top Followed Users</h2>
          <div className="flex flex-col gap-4 max-h-72 overflow-y-auto scrollbar-hidden">
            {popularUser.map((user) => (
              <div key={user._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center">
                    <img src={user.profilePicture} alt="" className='w-full h-full object-cover rounded-full' />
                  </div>
                  <div>
                    <div className="font-medium">{user.username}</div>
                    <div className="text-gray-500 text-sm">{user.email}</div>
                  </div>
                </div>
                <div className="text-right font-medium">
                  {user.followersCount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardDetials;