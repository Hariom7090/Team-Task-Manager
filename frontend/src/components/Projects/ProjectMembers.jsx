import React, { useState } from 'react';
import { FiUserPlus, FiX, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProjectMembers = ({ members, onAddMember, onRemoveMember, isAdmin }) => {
  const [showAddMember, setShowAddMember] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddMember = async () => {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    setLoading(true);
    try {
      await onAddMember(email);
      setEmail('');
      setShowAddMember(false);
      toast.success('Member added successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Team Members</h3>
        {isAdmin && (
          <button
            onClick={() => setShowAddMember(true)}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
          >
            <FiUserPlus size={18} />
            <span>Add Member</span>
          </button>
        )}
      </div>

      <div className="space-y-3">
        {members?.map((member) => (
          <div key={member.user?.id || member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <FiUser className="text-blue-600" size={16} />
              </div>
              <div>
                <p className="font-medium">{member.user?.name || member.name}</p>
                <p className="text-sm text-gray-500">{member.user?.email || member.email}</p>
              </div>
            </div>
            {isAdmin && member.user?.role !== 'admin' && (
              <button
                onClick={() => onRemoveMember(member.user?.id || member.id)}
                className="text-red-500 hover:text-red-700"
              >
                <FiX size={18} />
              </button>
            )}
          </div>
        ))}

        {members?.length === 0 && (
          <p className="text-center text-gray-500 py-4">No team members yet</p>
        )}
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Add Team Member</h2>
              <button onClick={() => setShowAddMember(false)} className="text-gray-400 hover:text-gray-600">
                <FiX size={24} />
              </button>
            </div>

            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter user email"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-2">
                User must be registered in the system
              </p>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t">
              <button onClick={() => setShowAddMember(false)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleAddMember} className="btn-primary" disabled={loading}>
                {loading ? 'Adding...' : 'Add Member'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectMembers;