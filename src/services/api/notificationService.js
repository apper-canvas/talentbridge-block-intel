import mockNotifications from '@/services/mockData/notifications.json';

// Mock delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const notificationService = {
  getAll: async () => {
    await delay(300);
    return [...mockNotifications];
  },

  getById: async (id) => {
    await delay(200);
    const notification = mockNotifications.find(n => n.Id === id);
    if (!notification) {
      throw new Error('Notification not found');
    }
    return { ...notification };
  },

  create: async (notificationData) => {
    await delay(400);
    const newNotification = {
      ...notificationData,
      Id: Math.max(...mockNotifications.map(n => n.Id)) + 1,
      createdAt: new Date().toISOString(),
      read: false
    };
    mockNotifications.push(newNotification);
    return { ...newNotification };
  },

  update: async (id, notificationData) => {
    await delay(300);
    const index = mockNotifications.findIndex(n => n.Id === id);
    if (index === -1) {
      throw new Error('Notification not found');
    }
    mockNotifications[index] = { ...mockNotifications[index], ...notificationData };
    return { ...mockNotifications[index] };
  },

  delete: async (id) => {
    await delay(300);
    const index = mockNotifications.findIndex(n => n.Id === id);
    if (index === -1) {
      throw new Error('Notification not found');
    }
    const deleted = mockNotifications.splice(index, 1)[0];
    return { ...deleted };
  },

  markAsRead: async (id) => {
    await delay(200);
    const notification = mockNotifications.find(n => n.Id === id);
    if (!notification) {
      throw new Error('Notification not found');
    }
    notification.read = true;
    return { ...notification };
  },

  markAsUnread: async (id) => {
    await delay(200);
    const notification = mockNotifications.find(n => n.Id === id);
    if (!notification) {
      throw new Error('Notification not found');
    }
    notification.read = false;
    return { ...notification };
  },

  markAllAsRead: async () => {
    await delay(400);
    mockNotifications.forEach(notification => {
      notification.read = true;
    });
    return mockNotifications.map(n => ({ ...n }));
  },

  getUnreadCount: async () => {
    await delay(100);
    return mockNotifications.filter(n => !n.read).length;
  }
};