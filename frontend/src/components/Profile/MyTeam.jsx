import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { server } from '../../server';
import { toast } from 'react-toastify';
import styles from '../../styles/styles';
import { format } from 'date-fns';

const MyTeam = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const { data } = await axios.get(
          `${server}/user/my-team/${user._id}`,
          { withCredentials: true }
        );
        setTeamMembers(data.team);
        setLoading(false);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching team members");
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [user._id]);

  return (
    <div className="w-full px-5">
      {/* Referral Info Section */}
      <div className="w-full bg-white dark:bg-dark-secondary rounded-[8px] shadow p-8 mb-8">
        <h2 className="text-[25px] font-[600] text-[#000000ba] dark:text-white pb-4">
          Your Referral Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 dark:text-gray-300 mb-2">Your Referral Code:</p>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-semibold text-blue-600">
                {user.referralCode || "No referral code"}
              </span>
              <button
                onClick={() => {
                  if (user.referralCode) {
                    navigator.clipboard.writeText(user.referralCode);
                    toast.success("Referral code copied!");
                  }
                }}
                className={`${styles.button} !h-[35px] !w-[100px] !rounded-[5px]`}
              >
                Copy
              </button>
            </div>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-300 mb-2">Total Referrals:</p>
            <span className="text-2xl font-semibold text-blue-600">
              {teamMembers.length}
            </span>
          </div>
        </div>
      </div>

      {/* Team Members List */}
      <div className="w-full bg-white dark:bg-dark-secondary rounded-[8px] shadow p-8">
        <h2 className="text-[25px] font-[600] text-[#000000ba] dark:text-white pb-4">
          Team Members
        </h2>
        {loading ? (
          <p>Loading...</p>
        ) : teamMembers.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            No team members yet. Share your referral code to grow your team!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left py-3">Member</th>
                  <th className="text-left py-3">Joined Date</th>
                  <th className="text-left py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member) => (
                  <tr key={member._id} className="border-b dark:border-gray-700">
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={`${server}/${member.avatar}`}
                          alt={member.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium dark:text-white">{member.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      {format(new Date(member.createdAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="py-4">
                      <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTeam; 