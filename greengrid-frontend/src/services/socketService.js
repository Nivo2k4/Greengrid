// src/services/socketService.js
import { io } from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.listeners = new Map();
    }

    // Connect to Socket.io server
    connect(serverUrl = 'http://localhost:5000') {
        if (this.socket && this.isConnected) {
            return;
        }

        console.log('🔌 Connecting to real-time server...');

        this.socket = io(serverUrl, {
            transports: ['websocket', 'polling'],
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        // Connection events
        this.socket.on('connect', () => {
            console.log('✅ Connected to real-time server:', this.socket.id);
            this.isConnected = true;
        });

        this.socket.on('disconnect', (reason) => {
            console.log('❌ Disconnected from real-time server:', reason);
            this.isConnected = false;
        });

        this.socket.on('connect_error', (error) => {
            console.error('❌ Socket connection error:', error);
        });

        this.socket.on('reconnect', (attemptNumber) => {
            console.log('🔄 Reconnected to server on attempt:', attemptNumber);
        });
    }

    // Disconnect from server
    disconnect() {
        if (this.socket) {
            console.log('🔌 Disconnecting from real-time server...');
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
            this.listeners.clear();
        }
    }

    // Join admin room (for admin users)
    joinAdmin() {
        if (this.socket && this.isConnected) {
            this.socket.emit('joinAdmin');
            console.log('👨‍💼 Joined admin room');
        }
    }

    // Join user room (for regular users)
    joinUser(userId) {
        if (this.socket && this.isConnected) {
            this.socket.emit('joinUser', userId);
            console.log(`👤 Joined as user: ${userId}`);
        }
    }

    // Listen for new reports
    onNewReport(callback) {
        if (this.socket) {
            this.socket.on('newReport', callback);
            this.listeners.set('newReport', callback);
        }
    }

    // Listen for urgent alerts
    onUrgentAlert(callback) {
        if (this.socket) {
            this.socket.on('urgentAlert', callback);
            this.listeners.set('urgentAlert', callback);
        }
    }

    // Listen for dashboard updates
    onDashboardUpdate(callback) {
        if (this.socket) {
            this.socket.on('dashboardUpdate', callback);
            this.listeners.set('dashboardUpdate', callback);
        }
    }

    // Remove specific listener
    removeListener(eventName) {
        if (this.socket && this.listeners.has(eventName)) {
            this.socket.off(eventName, this.listeners.get(eventName));
            this.listeners.delete(eventName);
        }
    }

    // Remove all listeners
    removeAllListeners() {
        if (this.socket) {
            this.listeners.forEach((callback, eventName) => {
                this.socket.off(eventName, callback);
            });
            this.listeners.clear();
        }
    }

    // Get connection status
    isSocketConnected() {
        return this.isConnected && this.socket?.connected;
    }
}

// Export singleton instance
export const socketService = new SocketService();
