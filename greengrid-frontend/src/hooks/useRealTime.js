// src/hooks/useRealTime.js
import { useEffect, useCallback } from 'react';
import { socketService } from '../services/socketService';

export const useRealTime = (options = {}) => {
    const {
        onNewReport,
        onUrgentAlert,
        onDashboardUpdate,
        autoConnect = true,
        userRole = 'resident'
    } = options;

    // Connect to real-time server
    const connect = useCallback(() => {
        socketService.connect();

        // Join appropriate room based on user role
        if (userRole === 'admin') {
            socketService.joinAdmin();
        } else {
            socketService.joinUser('user123'); // Replace with actual user ID
        }
    }, [userRole]);

    // Disconnect from server
    const disconnect = useCallback(() => {
        socketService.disconnect();
    }, []);

    // Setup event listeners
    useEffect(() => {
        if (!autoConnect) return;

        // Connect to server
        connect();

        // Setup listeners
        if (onNewReport) {
            socketService.onNewReport(onNewReport);
        }

        if (onUrgentAlert) {
            socketService.onUrgentAlert(onUrgentAlert);
        }

        if (onDashboardUpdate) {
            socketService.onDashboardUpdate(onDashboardUpdate);
        }

        // Cleanup on unmount
        return () => {
            socketService.removeAllListeners();
            socketService.disconnect();
        };
    }, [autoConnect, onNewReport, onUrgentAlert, onDashboardUpdate, connect]);

    return {
        connect,
        disconnect,
        isConnected: socketService.isSocketConnected()
    };
};
