import { db } from './firebase';
import { collection, query, where, orderBy, onSnapshot, limit, updateDoc, doc, writeBatch } from 'firebase/firestore';

/**
 * Subscribe to real-time notifications
 * @param {string} userId - User ID
 * @param {Function} callback - Callback function to handle notifications
 * @returns {Function} - Unsubscribe function
 */
export const subscribeToNotifications = (userId, callback) => {
  const notificationsRef = collection(db, 'notifications');
  const q = query(
    notificationsRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(50)
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const notifications = [];
      snapshot.forEach((doc) => {
        notifications.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      callback(notifications);
    },
    (error) => {
      console.error('Notifications subscription error:', error);
    }
  );

  return unsubscribe;
};

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 * @returns {Promise<void>}
 */
export const markAsRead = async (notificationId) => {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, {
      read: true,
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    throw error;
  }
};

/**
 * Mark all notifications as read
 * @param {string[]} notificationIds - Array of notification IDs
 * @returns {Promise<void>}
 */
export const markAllAsRead = async (notificationIds) => {
  try {
    const batch = writeBatch(db);
    
    notificationIds.forEach((id) => {
      const notificationRef = doc(db, 'notifications', id);
      batch.update(notificationRef, { read: true });
    });

    await batch.commit();
  } catch (error) {
    console.error('Mark all as read error:', error);
    throw error;
  }
};

/**
 * Request browser notification permission
 * @returns {Promise<string>} - Permission status
 */
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
};

/**
 * Show browser notification
 * @param {string} title - Notification title
 * @param {Object} options - Notification options
 */
export const showBrowserNotification = (title, options = {}) => {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      ...options,
    });

    notification.onclick = () => {
      window.focus();
      if (options.actionUrl) {
        window.location.href = options.actionUrl;
      }
      notification.close();
    };

    return notification;
  }
};

/**
 * Get unread notification count
 * @param {Array} notifications - Array of notifications
 * @returns {number}
 */
export const getUnreadCount = (notifications) => {
  return notifications.filter((n) => !n.read).length;
};

/**
 * Group notifications by date
 * @param {Array} notifications - Array of notifications
 * @returns {Object} - Grouped notifications
 */
export const groupNotificationsByDate = (notifications) => {
  const groups = {
    today: [],
    yesterday: [],
    thisWeek: [],
    older: [],
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  notifications.forEach((notification) => {
    const notifDate = notification.createdAt?.toDate?.() || new Date(notification.createdAt);
    const notifDay = new Date(notifDate.getFullYear(), notifDate.getMonth(), notifDate.getDate());

    if (notifDay.getTime() === today.getTime()) {
      groups.today.push(notification);
    } else if (notifDay.getTime() === yesterday.getTime()) {
      groups.yesterday.push(notification);
    } else if (notifDate >= weekAgo) {
      groups.thisWeek.push(notification);
    } else {
      groups.older.push(notification);
    }
  });

  return groups;
};

/**
 * Format notification time
 * @param {Date|Object} timestamp - Timestamp
 * @returns {string}
 */
export const formatNotificationTime = (timestamp) => {
  const date = timestamp?.toDate?.() || new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
};

/**
 * Get notification icon based on type
 * @param {string} type - Notification type
 * @returns {string} - Icon name
 */
export const getNotificationIcon = (type) => {
  const iconMap = {
    application_status: 'CheckCircle',
    new_application: 'Users',
    new_opportunity: 'ClipboardList',
    donation_update: 'DollarSign',
    new_donation: 'Heart',
    message: 'Mail',
    certificate: 'Award',
    verification: 'Shield',
    reminder: 'Bell',
  };

  return iconMap[type] || 'Bell';
};

/**
 * Get notification color based on type
 * @param {string} type - Notification type
 * @returns {string} - Color class
 */
export const getNotificationColor = (type) => {
  const colorMap = {
    application_status: 'text-teal bg-teal-light',
    new_application: 'text-amber-dark bg-amber-light',
    new_opportunity: 'text-teal bg-teal-light',
    donation_update: 'text-coral bg-coral-light',
    new_donation: 'text-coral bg-coral-light',
    message: 'text-teal bg-teal-light',
    certificate: 'text-amber-dark bg-amber-light',
    verification: 'text-teal bg-teal-light',
    reminder: 'text-muted bg-warm',
  };

  return colorMap[type] || 'text-muted bg-warm';
};

/**
 * Create notification sound
 */
export const playNotificationSound = () => {
  try {
    const audio = new Audio('/notification.mp3');
    audio.volume = 0.5;
    audio.play().catch((error) => {
      console.warn('Could not play notification sound:', error);
    });
  } catch (error) {
    console.warn('Notification sound error:', error);
  }
};

/**
 * Setup notification preferences
 * @param {Object} preferences - User notification preferences
 * @returns {Object} - Processed preferences
 */
export const setupNotificationPreferences = (preferences = {}) => {
  const defaults = {
    emailNewOpportunities: true,
    emailApplicationStatus: true,
    emailNGOUpdates: false,
    emailDonationUpdates: true,
    pushNewOpportunities: true,
    pushMessages: true,
    pushDonationUpdates: true,
    browserNotifications: true,
    soundEnabled: true,
  };

  return { ...defaults, ...preferences };
};

/**
 * Check if notification should be shown based on preferences
 * @param {string} type - Notification type
 * @param {Object} preferences - User preferences
 * @returns {boolean}
 */
export const shouldShowNotification = (type, preferences) => {
  const typeMap = {
    new_opportunity: 'pushNewOpportunities',
    application_status: 'pushMessages',
    new_application: 'pushMessages',
    donation_update: 'pushDonationUpdates',
    new_donation: 'pushDonationUpdates',
    message: 'pushMessages',
  };

  const prefKey = typeMap[type];
  return prefKey ? preferences[prefKey] !== false : true;
};

/**
 * Batch delete notifications
 * @param {string[]} notificationIds - Array of notification IDs
 * @returns {Promise<void>}
 */
export const deleteNotifications = async (notificationIds) => {
  try {
    const batch = writeBatch(db);
    
    notificationIds.forEach((id) => {
      const notificationRef = doc(db, 'notifications', id);
      batch.delete(notificationRef);
    });

    await batch.commit();
  } catch (error) {
    console.error('Delete notifications error:', error);
    throw error;
  }
};

/**
 * Create a notification component hook
 * @param {string} userId - User ID
 * @returns {Object} - Notification state and methods
 */
export const useNotifications = (userId) => {
  const [notifications, setNotifications] = React.useState([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToNotifications(userId, (newNotifications) => {
      setNotifications(newNotifications);
      setUnreadCount(getUnreadCount(newNotifications));
      setLoading(false);

      // Show browser notification for new unread notifications
      const latestUnread = newNotifications.find((n) => !n.read);
      if (latestUnread && Notification.permission === 'granted') {
        showBrowserNotification(latestUnread.title, {
          body: latestUnread.message,
          actionUrl: latestUnread.actionUrl,
        });
        playNotificationSound();
      }
    });

    return () => unsubscribe();
  }, [userId]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead: () => markAllAsRead(notifications.filter((n) => !n.read).map((n) => n.id)),
    deleteNotifications,
  };
};
