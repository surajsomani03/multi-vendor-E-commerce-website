import React from "react";
import { FiUsers, FiShoppingBag, FiDollarSign, FiPackage } from "react-icons/fi";
import { useSelector } from "react-redux";
import { ThemeProvider } from "../../context/ThemeContext";
import ThemeToggle from "./ThemeToggle";
import styles from "../../styles/styles";
import { useNavigate } from "react-router-dom";

const AdminDashboardMain = () => {
  const navigate = useNavigate();
  const { adminOrders, adminOrderLoading } = useSelector((state) => state.order);
  const { sellers } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);
  const { users } = useSelector((state) => state.user);

  const statsData = [
    {
      title: "Total Users",
      count: users?.length,
      icon: <FiUsers className="w-8 h-8" />,
      color: "bg-blue-500",
      link: "/admin-users"
    },
    {
      title: "Total Sellers",
      count: sellers?.length,
      icon: <FiUsers className="w-8 h-8" />,
      color: "bg-green-500",
      link: "/admin-sellers"
    },
    {
      title: "Total Products",
      count: products?.length,
      icon: <FiPackage className="w-8 h-8" />,
      color: "bg-yellow-500",
      link: "/admin-products"
    },
    {
      title: "Total Orders",
      count: adminOrders?.length,
      icon: <FiShoppingBag className="w-8 h-8" />,
      color: "bg-purple-500",
      link: "/admin-orders"
    },
  ];

  return (
    <div className="w-full min-h-screen p-4 bg-gray-100 dark:bg-dark-bg transition-colors duration-200">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <div
            key={index}
            onClick={() => navigate(stat.link)}
            className={`p-6 rounded-lg shadow-md bg-white dark:bg-dark-secondary 
              transform hover:scale-105 transition-all duration-200 cursor-pointer
              hover:shadow-lg relative overflow-hidden group`}
          >
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm text-gray-600 dark:text-dark-text mb-1">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {stat.count || 0}
                </h3>
              </div>
              <div className={`${stat.color} p-3 rounded-full text-white`}>
                {stat.icon}
              </div>
            </div>
            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-200" />
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Recent Orders
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b dark:border-gray-700">
                  <th className="pb-3 text-gray-600 dark:text-dark-text">Order ID</th>
                  <th className="pb-3 text-gray-600 dark:text-dark-text">Amount</th>
                  <th className="pb-3 text-gray-600 dark:text-dark-text">Status</th>
                </tr>
              </thead>
              <tbody>
                {adminOrders?.slice(0, 5).map((order) => (
                  <tr key={order._id} className="border-b dark:border-gray-700">
                    <td className="py-2 text-gray-800 dark:text-gray-200">
                      #{order._id.slice(0, 8)}
                    </td>
                    <td className="py-2 text-gray-800 dark:text-gray-200">
                      ₹{order.totalPrice}
                    </td>
                    <td className="py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Sellers */}
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Recent Sellers
          </h2>
          <div className="space-y-4">
            {sellers?.slice(0, 5).map((seller) => (
              <div
                key={seller._id}
                className="flex items-center space-x-4 border-b dark:border-gray-700 pb-4"
              >
                <img
                  src={`${seller.avatar}`}
                  alt={seller.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {seller.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-dark-text">
                    {seller.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardMain;
