'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface NotificationContextType {
  notificationsEnabled: boolean;
  enableNotifications: () => Promise<boolean>;
  sendNotification: (title: string, message: string, url?: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return;
    }

    // Check if already granted
    if (Notification.permission === 'granted') {
      setNotificationsEnabled(true);
    }
  }, []);

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        return registration;
      } catch (error) {
        console.error('Service worker registration failed:', error);
        return null;
      }
    }
    return null;
  };

  const enableNotifications = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      toast.error('Notifications are not supported in this browser');
      return false;
    }

    try {
      // Request permission
      const permission = await Notification.requestPermission();
      
      if (permission !== 'granted') {
        toast.error('Notification permission denied');
        return false;
      }

      // Register service worker
      const registration = await registerServiceWorker();
      if (!registration) {
        toast.error('Failed to register service worker');
        return false;
      }

      // Get push subscription
      let subscription = await registration.pushManager.getSubscription();
      
      // Create new subscription if none exists
      if (!subscription) {
        try {
          // In a real app, you would fetch this from your server
          const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
          
          if (!vapidPublicKey) {
            console.error('VAPID public key not found');
            return false;
          }
          
          const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
          
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey
          });
        } catch (error) {
          console.error('Failed to subscribe to push notifications:', error);
          return false;
        }
      }

      // Register subscription with server
      const response = await fetch('/api/notifications/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscription }),
      });

      if (!response.ok) {
        throw new Error('Failed to register notification subscription');
      }

      setNotificationsEnabled(true);
      toast.success('Notifications enabled successfully!');
      return true;
    } catch (error) {
      console.error('Error enabling notifications:', error);
      toast.error('Failed to enable notifications');
      return false;
    }
  };

  const sendNotification = async (title: string, message: string, url?: string) => {
    if (!notificationsEnabled) {
      console.warn('Notifications not enabled');
      return;
    }

    // For testing purposes, we'll show a local notification
    // In production, you'd send this through your server
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: message,
          icon: '/icons/icon-192x192.png',
          data: { url }
        });
      } catch (error) {
        console.error('Error showing notification:', error);
      }
    }
  };

  return (
    <NotificationContext.Provider value={{ 
      notificationsEnabled, 
      enableNotifications,
      sendNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Helper function to convert base64 to Uint8Array
// (Required for VAPID keys with Push API)
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}