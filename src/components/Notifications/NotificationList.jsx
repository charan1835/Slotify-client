import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotifications, markNotificationAsRead, markAllNotificationsRead, deleteNotification } from '../../redux/notificationSlice';


const NotificationList = ({ onClose }) => {
    const dispatch = useDispatch();
    const { items, loading } = useSelector((state) => state.notification);
    const listRef = useRef();

    useEffect(() => {
        dispatch(fetchNotifications());
    }, [dispatch]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (listRef.current && !listRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleMarkAsRead = (id) => {
        dispatch(markNotificationAsRead(id));
    };

    const handleDelete = (e, id) => {
        e.stopPropagation();
        dispatch(deleteNotification(id));
    };

    const handleMarkAllRead = () => {
        dispatch(markAllNotificationsRead());
    };

    return (
        <div
            ref={listRef}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden z-50 border border-gray-100 dark:border-gray-700 ring-1 ring-black ring-opacity-5"
        >
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center backdrop-blur-sm">
                <h3 className="font-bold text-gray-900 dark:text-gray-100">Notifications</h3>
                {items.length > 0 && (
                    <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 font-medium transition-colors"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
                {loading && items.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <div className="animate-spin w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                        Loading...
                    </div>
                ) : items.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                        <div className="text-4xl mb-3">🔕</div>
                        <p className="text-sm">No notifications yet</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                        {items.map((item) => (
                            <li
                                key={item._id}
                                className={`group relative p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${!item.read ? 'bg-violet-50/30 dark:bg-violet-900/10' : ''}`}
                                onClick={() => handleMarkAsRead(item._id)}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!item.read ? 'bg-violet-600' : 'bg-transparent'}`}></div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm ${!item.read ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                                            {item.message}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(item.createdAt).toLocaleDateString()} • {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => handleDelete(e, item._id)}
                                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity"
                                        title="Delete"
                                    >
                                        ×
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default NotificationList;
