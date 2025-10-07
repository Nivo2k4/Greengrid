// src/hooks/useNotifications.js
import { useEffect, useState } from 'react';
import { notificationService } from '../services/notificationService';

export const useNotifications = (options = {}) => {
    const [permissionStatus, setPermissionStatus] = useState('default');
    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {
        const status = notificationService.getPermissionStatus();
        setPermissionStatus(status.permission);
        setIsEnabled(status.canShow);
    }, []);

    const requestPermission = async () => {
        const granted = await notificationService.requestPermission();
        setPermissionStatus(granted ? 'granted' : 'denied');
        setIsEnabled(granted);
        return granted;
    };

    const showTestNotification = () => {
        notificationService.showNotification({
            title: '🧪 Test Notification',
            body: 'This is a test notification from GreenGrid!',
            tag: 'test'
        });
    };

    return {
        permissionStatus,
        isEnabled,
        requestPermission,
        showTestNotification,
        notificationService
    };
};
