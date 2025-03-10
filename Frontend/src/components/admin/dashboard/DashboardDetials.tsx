import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const DashboardDetials = () => {
  const monthlyData = [
    { name: 'Jan', value: 3000 },
    { name: 'Feb', value: 4500 },
    { name: 'Mar', value: 2800 },
    { name: 'Apr', value: 3200 },
    { name: 'May', value: 2500 },
    { name: 'Jun', value: 2200 },
    { name: 'Jul', value: 1800 },
    { name: 'Aug', value: 1500 },
    { name: 'Sep', value: 4000 },
    { name: 'Oct', value: 3000 },
    { name: 'Nov', value: 3500 },
    { name: 'Dec', value: 2000 },
  ];

  const recentSales = [
    { name: 'Olivia Martin', email: 'olivia.martin@email.com', amount: 1999.00 },
    { name: 'Jackson Lee', email: 'jackson.lee@email.com', amount: 39.00 },
    { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', amount: 299.00 },
    { name: 'William Kim', email: 'will@email.com', amount: 99.00 },
    { name: 'Sofia Davis', email: 'sofia.davis@email.com', amount: 39.00 },
    { name: 'Olivia Martin', email: 'olivia.martin@email.com', amount: 1999.00 },
    { name: 'Jackson Lee', email: 'jackson.lee@email.com', amount: 39.00 },
    { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', amount: 299.00 },
    { name: 'William Kim', email: 'will@email.com', amount: 99.00 },
    { name: 'Sofia Davis', email: 'sofia.davis@email.com', amount: 39.00 },
  ];

  return (
    <div className="min-h-screen p-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Total Revenue</span>
            <span className="text-gray-400">$</span>
          </div>
          <div className="text-2xl font-bold mb-1">$45,231.89</div>
          <div className="text-green-500 text-sm">+20.1% from last month</div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Subscriptions</span>
            <span className="text-gray-400">%</span>
          </div>
          <div className="text-2xl font-bold mb-1">+2350</div>
          <div className="text-green-500 text-sm">+180.1% from last month</div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Sales</span>
            <span className="text-gray-400">=</span>
          </div>
          <div className="text-2xl font-bold mb-1">+12,234</div>
          <div className="text-green-500 text-sm">+19% from last month</div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Active Now</span>
            <span className="text-gray-400">%</span>
          </div>
          <div className="text-2xl font-bold mb-1">+573</div>
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
          <h2 className="text-lg font-bold mb-4">Recent Sales</h2>
          <p className="text-gray-400 text-sm mb-4">You made 265 sales this month.</p>

          <div className="flex flex-col gap-4 max-h-72 overflow-y-auto scrollbar-hidden">
            {recentSales.map((sale, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                    {sale.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{sale.name}</div>
                    <div className="text-gray-500 text-sm">{sale.email}</div>
                  </div>
                </div>
                <div className="text-right font-medium">
                  +${sale.amount.toFixed(2)}
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