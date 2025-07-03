import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { notificationService } from '@/services/api/notificationService';
import { formatDistanceToNow } from 'date-fns';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await notificationService.getAll();
      setNotifications(data);
    } catch (err) {
      setError('Failed to load notifications. Please try again.');
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.Id === id ? { ...n, read: true } : n)
      );
      toast.success('Notification marked as read');
    } catch (err) {
      toast.error('Failed to mark notification as read');
      console.error('Error marking as read:', err);
    }
  };

  const handleMarkAsUnread = async (id) => {
    try {
      await notificationService.markAsUnread(id);
      setNotifications(prev => 
        prev.map(n => n.Id === id ? { ...n, read: false } : n)
      );
      toast.success('Notification marked as unread');
    } catch (err) {
      toast.error('Failed to mark notification as unread');
      console.error('Error marking as unread:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this notification?')) {
      return;
    }

    try {
      await notificationService.delete(id);
      setNotifications(prev => prev.filter(n => n.Id !== id));
      toast.success('Notification deleted');
    } catch (err) {
      toast.error('Failed to delete notification');
      console.error('Error deleting notification:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark all as read');
      console.error('Error marking all as read:', err);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    return notification.type === filter;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'application':
        return 'FileText';
      case 'job':
        return 'Briefcase';
      case 'account':
        return 'User';
      default:
        return 'Bell';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'application':
        return 'text-blue-600';
      case 'job':
        return 'text-green-600';
      case 'account':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTypeCounts = () => {
    const counts = notifications.reduce((acc, notification) => {
      acc[notification.type] = (acc[notification.type] || 0) + 1;
      return acc;
    }, {});
    
    return {
      all: notifications.length,
      application: counts.application || 0,
      job: counts.job || 0,
      account: counts.account || 0
    };
  };

  const typeCounts = getTypeCounts();
  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) return <Loading type="notifications" />;
  if (error) return <Error message={error} onRetry={loadNotifications} />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">
              Notification Center
            </h1>
            <p className="text-gray-600">
              Stay updated with your applications, job recommendations, and account activity
            </p>
          </div>
          
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={handleMarkAllAsRead}
              icon="CheckCheck"
              size="small"
            >
              Mark All Read ({unreadCount})
            </Button>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <Empty
          icon="Bell"
          title="No notifications"
          message="You're all caught up! New notifications will appear here."
          showAction={false}
        />
      ) : (
        <>
          {/* Filter Tabs */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Filter Notifications
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({typeCounts.all})
              </button>
              <button
                onClick={() => setFilter('application')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'application'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Applications ({typeCounts.application})
              </button>
              <button
                onClick={() => setFilter('job')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'job'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Job Recommendations ({typeCounts.job})
              </button>
              <button
                onClick={() => setFilter('account')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'account'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Account ({typeCounts.account})
              </button>
            </div>
          </div>

          {/* Notifications List */}
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No notifications found for "{filter}" category.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  Showing {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
                  {filter !== 'all' && ` in "${filter}" category`}
                </p>
              </div>
              
              <div className="space-y-4">
                {filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`card p-6 ${!notification.read ? 'border-l-4 border-l-primary-500 bg-primary-50/30' : ''}`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        !notification.read ? 'bg-primary-100' : 'bg-gray-100'
                      }`}>
                        <ApperIcon 
                          name={getNotificationIcon(notification.type)} 
                          size={20} 
                          className={getNotificationColor(notification.type)}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className={`text-lg font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                {notification.title}
                              </h3>
                              {!notification.read && (
                                <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                              )}
                              <Badge variant="default" size="small">
                                {notification.type}
                              </Badge>
                            </div>
                            <p className={`${!notification.read ? 'text-gray-900' : 'text-gray-600'} mb-3`}>
                              {notification.message}
                            </p>
                            <div className="flex items-center text-sm text-gray-500">
                              <ApperIcon name="Clock" size={14} className="mr-1" />
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            {notification.read ? (
                              <button
                                onClick={() => handleMarkAsUnread(notification.Id)}
                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                title="Mark as unread"
                              >
                                <ApperIcon name="MailOpen" size={18} />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleMarkAsRead(notification.Id)}
                                className="p-2 text-primary-500 hover:text-primary-700 transition-colors"
                                title="Mark as read"
                              >
                                <ApperIcon name="Mail" size={18} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(notification.Id)}
                              className="p-2 text-red-400 hover:text-red-600 transition-colors"
                              title="Delete notification"
                            >
                              <ApperIcon name="Trash2" size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default NotificationCenter;