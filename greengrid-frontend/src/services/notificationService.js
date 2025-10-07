// src/services/notificationService.js

class NotificationService {
    constructor() {
        this.permission = 'default';
        this.isSupported = 'Notification' in window;
        this.init();
    }

    // Initialize notification service
    async init() {
        if (!this.isSupported) {
            console.warn('❌ Browser notifications not supported');
            return false;
        }

        this.permission = Notification.permission;
        console.log('🔔 Notification service initialized. Permission:', this.permission);
        return true;
    }

    // Request notification permission from user
    async requestPermission() {
        if (!this.isSupported) {
            return false;
        }

        if (this.permission === 'granted') {
            return true;
        }

        try {
            const permission = await Notification.requestPermission();
            this.permission = permission;

            if (permission === 'granted') {
                console.log('✅ Notification permission granted');
                // Show welcome notification
                this.showNotification({
                    title: '🎉 GreenGrid Notifications Enabled!',
                    body: 'You will now receive important alerts about waste management reports.',
                    icon: '/favicon.ico',
                    tag: 'welcome'
                });
                return true;
            } else {
                console.log('❌ Notification permission denied');
                return false;
            }
        } catch (error) {
            console.error('❌ Error requesting notification permission:', error);
            return false;
        }
    }

    // Show a notification
    showNotification(options) {
        if (!this.isSupported || this.permission !== 'granted') {
            console.warn('❌ Cannot show notification - no permission');
            return null;
        }

        const defaultOptions = {
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            vibrate: [200, 100, 200],
            requireInteraction: false,
            silent: false
        };

        const notification = new Notification(options.title, {
            ...defaultOptions,
            ...options
        });

        // Auto-close after 5 seconds (unless requireInteraction is true)
        if (!options.requireInteraction) {
            setTimeout(() => {
                notification.close();
            }, 5000);
        }

        // Handle click events
        notification.onclick = () => {
            window.focus();
            if (options.onClick) {
                options.onClick();
            }
            notification.close();
        };

        return notification;
    }

    // Show notification for new reports
    showNewReportNotification(report) {
        const priorityEmojis = {
            'critical': '🚨',
            'high': '⚠️',
            'medium': '📋',
            'low': '📝'
        };

        const emoji = priorityEmojis[report.priority] || '📋';
        const isUrgent = report.priority === 'critical' || report.priority === 'high';

        this.showNotification({
            title: `${emoji} New ${report.priority.toUpperCase()} Priority Report`,
            body: `${report.title}\n📍 Location: ${report.location}`,
            icon: '/favicon.ico',
            tag: `report-${report.id}`,
            requireInteraction: isUrgent,
            vibrate: isUrgent ? [300, 100, 300, 100, 300] : [200, 100, 200],
            onClick: () => {
                // Navigate to reports page when clicked
                window.location.hash = '#realtime';
            }
        });
    }

    // Show urgent admin alert
    showUrgentAlert(alert) {
        this.showNotification({
            title: '🚨 URGENT ADMIN ALERT',
            body: alert.message,
            icon: '/favicon.ico',
            tag: 'urgent-alert',
            requireInteraction: true,
            vibrate: [300, 100, 300, 100, 300, 100, 300],
            onClick: () => {
                window.location.hash = '#admin';
            }
        });
    }

    // Show dashboard update notification (less intrusive)
    showDashboardUpdate(update) {
        // Only show if it's a significant update
        if (update.action === 'REPORT_CREATED') {
            this.showNotification({
                title: '📊 Dashboard Updated',
                body: `New ${update.data.priority} priority ${update.data.type} report`,
                icon: '/favicon.ico',
                tag: 'dashboard-update',
                silent: true,
                requireInteraction: false
            });
        }
    }

    // Get permission status
    getPermissionStatus() {
        return {
            supported: this.isSupported,
            permission: this.permission,
            canShow: this.isSupported && this.permission === 'granted'
        };
    }
}

// Export singleton instance
export const notificationService = new NotificationService();
