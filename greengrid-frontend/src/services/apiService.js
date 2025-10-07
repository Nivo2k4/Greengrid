// src/services/apiService.js
const API_BASE = 'http://localhost:5000/api';

async function getIdToken() {
    try {
        const { auth } = await import('../config/firebase');
        // @ts-ignore
        const current = auth.currentUser;
        if (!current) return null;
        return await current.getIdToken();
    } catch {
        return null;
    }
}

export class ApiService {

    // Authentication
    static async syncUser(userData) {
        try {
            const response = await fetch(`${API_BASE}/auth/sync`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            return await response.json();
        } catch (error) {
            console.error('❌ Sync user error:', error);
            throw error;
        }
    }

    // Get all users (example public)
    static async getUsers() {
        try {
            const response = await fetch(`${API_BASE}/users`);
            return await response.json();
        } catch (error) {
            console.error('❌ Get users error:', error);
            throw error;
        }
    }

    // Get user by ID
    static async getUser(userId) {
        try {
            const response = await fetch(`${API_BASE}/users/${userId}`);
            return await response.json();
        } catch (error) {
            console.error('❌ Get user error:', error);
            throw error;
        }
    }

    // Get all reports (public GET)
    static async getReports(filters = {}) {
        try {
            const queryParams = new URLSearchParams();

            if (filters.status) queryParams.append('status', filters.status);
            if (filters.type) queryParams.append('type', filters.type);
            if (filters.priority) queryParams.append('priority', filters.priority);

            const url = `${API_BASE}/reports${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.error('❌ Get reports error:', error);
            throw error;
        }
    }

    // Create new report (protected)
    static async createReport(reportData) {
        try {
            const token = await getIdToken();
            const response = await fetch(`${API_BASE}/reports`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify(reportData)
            });
            return await response.json();
        } catch (error) {
            console.error('❌ Create report error:', error);
            throw error;
        }
    }

    // Get admin dashboard data (protected)
    static async getDashboard() {
        try {
            const token = await getIdToken();
            const response = await fetch(`${API_BASE}/admin/dashboard`, {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                }
            });
            return await response.json();
        } catch (error) {
            console.error('❌ Get dashboard error:', error);
            throw error;
        }
    }

    // Health check (public)
    static async healthCheck() {
        try {
            const response = await fetch(`${API_BASE}/health`);
            return await response.json();
        } catch (error) {
            console.error('❌ Health check error:', error);
            throw error;
        }
    }
}
