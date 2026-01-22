import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from '../redux/authSlice';
// We might want to add updateProfile to authSlice later, but for now let's use local state for editing
// actually, better to dispatch an action if we want to update the global user state.
// user is in redux. 

// Let's assume we want to just view for now, effectively.
// Or maybe implement a simple edit form.

const ProfilePage = () => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch(); // If we add update action

    // Local state for form
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setPhone(user.phone || '');
        }
    }, [user]);

    const handleSave = async () => {
        try {
            const resultAction = await dispatch(updateUserProfile({ name, phone }));
            if (updateUserProfile.fulfilled.match(resultAction)) {
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Failed to update profile", error);
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-2xl mx-auto py-12 px-4 pt-24 transition-colors duration-300">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">My Profile</h1>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
                <div className="p-8">
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-3xl font-bold text-gray-400 dark:text-gray-300">
                            {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.email}</h2>
                            <p className="text-gray-500 dark:text-gray-400">Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            ) : (
                                <div className="text-gray-900 dark:text-white font-medium">{user.name || 'Not set'}</div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            ) : (
                                <div className="text-gray-900 dark:text-white font-medium">{user.phone || 'Not set'}</div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-50 dark:border-gray-700 flex justify-end gap-3">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-90 transition"
                                >
                                    Save Changes
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-6 py-2 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-lg text-sm font-medium hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white transition"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
