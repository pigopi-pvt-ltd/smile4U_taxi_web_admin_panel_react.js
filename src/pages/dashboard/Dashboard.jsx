import React, { useState } from 'react';
import { 
  HiOutlineCalendar, HiOutlineUsers, HiTruck, HiUserGroup, 
  HiTrendingUp, HiTrendingDown, HiOutlineCheckCircle,
  HiOutlineXCircle, HiOutlineRefresh
} from 'react-icons/hi';
import { 
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, ComposedChart
} from 'recharts';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [refreshing, setRefreshing] = useState(false);

  const stats = [
    { 
      title: 'Total Bookings', 
      value: '1,234', 
      change: '+12.5%', 
      icon: HiOutlineCalendar, 
      color: 'from-primary-yellow to-yellow-600',
      trend: 'up'
    },
    { 
      title: 'Active Drivers', 
      value: '156', 
      change: '+5.2%', 
      icon: HiOutlineUsers, 
      color: 'from-primary-green to-green-600',
      trend: 'up'
    },
    { 
      title: 'Vehicles', 
      value: '89', 
      change: '+2.1%', 
      icon: HiTruck, 
      color: 'from-orange-500 to-orange-600',
      trend: 'up'
    },
    { 
      title: 'Customers', 
      value: '2,345', 
      change: '+8.7%', 
      icon: HiUserGroup, 
      color: 'from-pink-500 to-pink-600',
      trend: 'up'
    },
  ];

  const dailyData = [
    { date: 'Jan 15', bookings: 45 },
    { date: 'Jan 16', bookings: 52 },
    { date: 'Jan 17', bookings: 48 },
    { date: 'Jan 18', bookings: 61 },
    { date: 'Jan 19', bookings: 55 },
    { date: 'Jan 20', bookings: 67 },
    { date: 'Jan 21', bookings: 72 },
  ];

  const statusData = [
    { name: 'Completed', value: 845, color: '#00C853', percentage: 68 },
    { name: 'Confirmed', value: 234, color: '#2196F3', percentage: 19 },
    { name: 'Pending', value: 120, color: '#FFD700', percentage: 10 },
    { name: 'Cancelled', value: 35, color: '#FF5252', percentage: 3 },
  ];

  const monthlyData = [
    { month: 'Aug', bookings: 285 },
    { month: 'Sep', bookings: 324 },
    { month: 'Oct', bookings: 368 },
    { month: 'Nov', bookings: 412 },
    { month: 'Dec', bookings: 456 },
    { month: 'Jan', bookings: 489 },
  ];

  const vehicleData = [
    { name: 'Sedan', value: 45, color: '#FFD700', available: 38, maintenance: 5, booked: 2 },
    { name: 'SUV', value: 28, color: '#00C853', available: 22, maintenance: 4, booked: 2 },
    { name: 'Hatchback', value: 12, color: '#2196F3', available: 10, maintenance: 1, booked: 1 },
    { name: 'Luxury', value: 4, color: '#9C27B0', available: 3, maintenance: 1, booked: 0 },
  ];

  const topDrivers = [
    { name: 'Mike Smith', trips: 156, rating: 4.9, earnings: 8450, avatar: 'MS' },
    { name: 'Sarah Johnson', trips: 142, rating: 4.8, earnings: 7820, avatar: 'SJ' },
    { name: 'David Wilson', trips: 138, rating: 4.9, earnings: 7590, avatar: 'DW' },
    { name: 'Emily Davis', trips: 125, rating: 4.7, earnings: 6870, avatar: 'ED' },
    { name: 'James Taylor', trips: 118, rating: 4.8, earnings: 6490, avatar: 'JT' },
  ];

  const peakHoursData = [
    { hour: '6 AM', bookings: 12 },
    { hour: '8 AM', bookings: 28 },
    { hour: '10 AM', bookings: 35 },
    { hour: '12 PM', bookings: 42 },
    { hour: '2 PM', bookings: 38 },
    { hour: '4 PM', bookings: 45 },
    { hour: '6 PM', bookings: 52 },
    { hour: '8 PM', bookings: 48 },
    { hour: '10 PM', bookings: 30 },
  ];

  const recentBookings = [
    { id: 'BK-001', customer: 'John Doe', pickup: 'Downtown', dropoff: 'Airport', date: 'Jan 21', time: '09:30 AM', status: 'completed', amount: 45, driver: 'Mike Smith' },
    { id: 'BK-002', customer: 'Sarah Johnson', pickup: 'Mall', dropoff: 'Hotel', date: 'Jan 21', time: '11:15 AM', status: 'confirmed', amount: 32, driver: 'Sarah Johnson' },
    { id: 'BK-003', customer: 'Robert Brown', pickup: 'Station', dropoff: 'Business Park', date: 'Jan 21', time: '02:00 PM', status: 'pending', amount: 58, driver: 'David Wilson' },
    { id: 'BK-004', customer: 'Lisa Anderson', pickup: 'Airport', dropoff: 'Convention Center', date: 'Jan 20', time: '08:45 AM', status: 'completed', amount: 67, driver: 'Emily Davis' },
    { id: 'BK-005', customer: 'Michael Lee', pickup: 'Suburb', dropoff: 'City Center', date: 'Jan 20', time: '03:30 PM', status: 'completed', amount: 38, driver: 'James Taylor' },
    { id: 'BK-006', customer: 'Emma Watson', pickup: 'Hotel', dropoff: 'Airport', date: 'Jan 19', time: '07:00 AM', status: 'completed', amount: 52, driver: 'Mike Smith' },
    { id: 'BK-007', customer: 'Chris Evans', pickup: 'Downtown', dropoff: 'Stadium', date: 'Jan 19', time: '06:30 PM', status: 'cancelled', amount: 28, driver: 'Unassigned' },
    { id: 'BK-008', customer: 'Natalie Portman', pickup: 'Airport', dropoff: 'Resort', date: 'Jan 18', time: '10:00 AM', status: 'completed', amount: 89, driver: 'Sarah Johnson' },
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      toast.success('Dashboard refreshed!');
      setRefreshing(false);
    }, 1000);
  };

  const StatCard = ({ title, value, change, icon: Icon, color, trend }) => {
    const isPositive = trend === 'up';
    
    return (
      <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center`}>
            <Icon className="text-xl text-white" />
          </div>
          <div className={`flex items-center gap-0.5 text-xs font-semibold ${isPositive ? 'text-primary-green' : 'text-red-500'}`}>
            {isPositive ? <HiTrendingUp className="text-xs" /> : <HiTrendingDown className="text-xs" />}
            <span>{change}</span>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{value}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{title}</p>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Refresh Button */}
      {/* <div className="flex justify-end">
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 flex items-center gap-1.5"
        >
          <HiOutlineRefresh className={`text-sm ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div> */}

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bookings Trend */}
        <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Bookings Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.1} />
              <XAxis dataKey="date" stroke="#6B7280" fontSize={10} />
              <YAxis stroke="#6B7280" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '6px', fontSize: '12px' }} />
              <Bar dataKey="bookings" fill="#FFD700" name="Bookings" radius={[2, 2, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Booking Status */}
        <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Booking Status</h3>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
                fontSize={10}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '6px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Bookings */}
        <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Monthly Bookings</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.1} />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={10} />
              <YAxis stroke="#6B7280" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '6px', fontSize: '12px' }} />
              <Line type="monotone" dataKey="bookings" stroke="#FFD700" strokeWidth={2} dot={{ fill: '#FFD700', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Peak Hours */}
        <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Peak Hours</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={peakHoursData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.1} />
              <XAxis dataKey="hour" stroke="#6B7280" fontSize={9} angle={-45} textAnchor="end" height={60} />
              <YAxis stroke="#6B7280" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '6px', fontSize: '12px' }} />
              <Bar dataKey="bookings" fill="#FFD700" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Vehicle Fleet */}
      <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Vehicle Fleet</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {vehicleData.map((vehicle, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: vehicle.color }}></div>
                <span className="text-xl font-bold">{vehicle.value}</span>
              </div>
              <p className="font-semibold text-sm">{vehicle.name}</p>
              <div className="mt-2 space-y-0.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Available:</span>
                  <span className="font-semibold text-primary-green">{vehicle.available}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Maintenance:</span>
                  <span className="font-semibold text-orange-500">{vehicle.maintenance}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Drivers */}
      <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Top Drivers</h3>
          <button className="text-xs text-primary-yellow">View All →</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {topDrivers.map((driver, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 text-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold text-white ${
                index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
                index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-800' :
                'bg-gradient-to-br from-blue-500 to-blue-700'
              }`}>
                {driver.avatar}
              </div>
              <p className="font-semibold text-sm">{driver.name}</p>
              <p className="text-xs text-gray-500">{driver.trips} trips</p>
              <div className="flex items-center justify-center gap-0.5 mt-1">
                <span className="text-xs font-semibold">{driver.rating}</span>
                <span className="text-primary-yellow text-xs">★</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Recent Bookings</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">ID</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Customer</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 hidden sm:table-cell">Route</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 hidden md:table-cell">Date</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 hidden lg:table-cell">Driver</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Status</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {recentBookings.slice(0, 6).map((booking, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-3 py-2 whitespace-nowrap text-xs font-medium">{booking.id}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs">{booking.customer}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs hidden sm:table-cell">
                    {booking.pickup} → {booking.dropoff}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs hidden md:table-cell">{booking.date}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs hidden lg:table-cell">{booking.driver}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`inline-flex px-1.5 py-0.5 text-xs font-semibold rounded-full ${
                      booking.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                      booking.status === 'confirmed' ? 'bg-blue-500/10 text-blue-500' :
                      booking.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs font-bold">${booking.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs">
          <p className="text-gray-500">8 of 1,234 bookings</p>
          <div className="flex gap-1">
            <button className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">Prev</button>
            <button className="px-2 py-0.5 bg-primary-yellow text-primary-black rounded font-semibold">1</button>
            <button className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">2</button>
            <button className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">3</button>
            <button className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;