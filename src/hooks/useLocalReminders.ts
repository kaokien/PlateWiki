'use client';

import { useEffect } from 'react';
import { analytics } from '../utils/analytics';

/**
 * Hook to manage client-side daily training reminders.
 * Checks local storage settings, schedules, and triggers local notifications
 * to help users maintain their training streak.
 */
export function useLocalReminders() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    const checkAndTriggerReminder = () => {
      try {
        const isEnabled = localStorage.getItem('bw_daily_reminders') === 'true';
        if (!isEnabled || Notification.permission !== 'granted') return;

        const scheduledTime = localStorage.getItem('bw_reminder_hour') || '09:00';
        const [scheduledHour, scheduledMin] = scheduledTime.split(':').map(Number);

        const now = new Date();
        const currentHour = now.getHours();
        const currentMin = now.getMinutes();

        // Check if we reached the scheduled hour
        if (currentHour > scheduledHour || (currentHour === scheduledHour && currentMin >= scheduledMin)) {
          const todayStr = now.toISOString().split('T')[0];
          const lastReminderDate = localStorage.getItem('bw_last_reminder_date');

          if (lastReminderDate !== todayStr) {
            new Notification('Time to Train! 🥊', {
              body: "Keep your daily boxing streak active. Open FoodWiki and complete your Drill of the Day!",
              icon: '/favicon.svg',
            });
            localStorage.setItem('bw_last_reminder_date', todayStr);
            analytics.customEvent('local_reminder_delivered', { scheduled_hour: scheduledTime });
          }
        }
      } catch (err) {
        console.warn('Failed to check/trigger local reminders:', err);
      }
    };

    // Run check on mount
    checkAndTriggerReminder();

    // Check periodically every 60 seconds (low overhead)
    const interval = setInterval(checkAndTriggerReminder, 60000);
    return () => clearInterval(interval);
  }, []);
}
