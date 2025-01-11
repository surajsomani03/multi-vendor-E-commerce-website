import React from 'react';
import { motion } from 'framer-motion';
import styles from '../../styles/styles';
import { FiGift, FiAward, FiTrendingUp } from 'react-icons/fi';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';
import { Link } from "react-router-dom";


const PrizeBonanza = () => {
  const prizes = [
    {
      icon: <FiGift className="text-4xl text-purple-500" />,
      title: "Welcome Bonus",
      description: "Get ₹100 on signup",
      color: "bg-purple-50"
    },
    {
      icon: <FiAward className="text-4xl text-blue-500" />,
      title: "Referral Bonus",
      description: "Earn ₹50 per referral",
      color: "bg-blue-50"
    },
    {
      icon: <RiMoneyDollarCircleLine className="text-4xl text-green-500" />,
      title: "Shopping Rewards",
      description: "Up to 10% cashback",
      color: "bg-green-50"
    },
    {
      icon: <FiTrendingUp className="text-4xl text-orange-500" />,
      title: "Level Up Bonus",
      description: "Extra rewards on milestones",
      color: "bg-orange-50"
    }
  ];

  return (
    <div className="w-full bg-gradient-to-b from-[#f5f5f5] to-white">
      <div className={`${styles.section} relative`}>
        {/* Main Content */}
        <div className="flex flex-col items-center justify-center py-10">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Win Big with Our
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
                {" "}Prize Bonanza!
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join our community and unlock amazing rewards. Refer friends, shop, and earn exciting bonuses!
            </p>
          </motion.div>

          {/* Prize Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
            {prizes.map((prize, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${prize.color} rounded-2xl p-6 hover:shadow-lg transition-all duration-300 
                  transform hover:-translate-y-1 cursor-pointer`}
              >
                <div className="flex flex-col items-center text-center">
                  {prize.icon}
                  <h3 className="text-xl font-semibold mt-4 mb-2">{prize.title}</h3>
                  <p className="text-gray-600">{prize.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <Link to="/products">
              <button 
                className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 
                  hover:to-blue-600 text-white font-semibold py-4 px-8 rounded-full 
                  transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Start Shopping Now
              </button>
            </Link>
          </motion.div>

          {/* Stats Section */}
          <div className="flex flex-wrap justify-center gap-8 mt-16">
            {[
              { label: "Total Rewards Given", value: "₹1M+" },
              { label: "Happy Members", value: "50K+" },
              { label: "Average Earnings", value: "₹2000" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-purple-200 rounded-full opacity-20" />
          <div className="absolute bottom-40 right-10 w-32 h-32 bg-blue-200 rounded-full opacity-20" />
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-green-200 rounded-full opacity-20" />
        </div>
      </div>
    </div>
  );
};

export default PrizeBonanza; 