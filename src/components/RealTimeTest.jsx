// src/components/RealTimeTest.jsx
import React, { useState, useEffect } from 'react';
import { useRealTime } from '../hooks/useRealTime';
import { ApiService } from '../services/apiService';

export const RealTimeTest = () => {
    const [reports, setReports] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Real-time event handlers
    const handleNewReport = (data) => {
        console.log('🔥 New report received:', data);
        setReports(prev => [data.data, ...prev]);
        setNotifications(prev => [...prev, {
            id: Date.now(),
            type: 'info',
            message: `📋 New report: ${data.data.title}`
        }]);
    };

    const handleUrgentAlert = (data) => {
        console.log('🚨 Urgent alert received:', data);
        setNotifications(prev => [...prev, {
            id: Date.now(),
            type: 'error',
            message: `🚨 ${data.message}`
        }]);
    };

    const handleDashboardUpdate = (data) => {
        console.log('📊 Dashboard update received:', data);
        setNotifications(prev => [...prev, {
            id: Date.now(),
            type: 'success',
            message: `📊 Dashboard updated`
        }]);
    };

    // Setup real-time connection
    useRealTime({
        onNewReport: handleNewReport,
        onUrgentAlert: handleUrgentAlert,
        onDashboardUpdate: handleDashboardUpdate,
        userRole: 'admin' // Change to 'resident' for regular user
    });

    // Load initial reports
    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        setIsLoading(true);
        try {
            const result = await ApiService.getReports();
            if (result.success) {
                setReports(result.reports);
            }
        } catch (error) {
            console.error('Failed to load reports:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Create test report
    const createTestReport = async () => {
        try {
            const testReport = {
                title: `🧪 Test Report ${Date.now()}`,
                location: 'Test Location, Colombo',
                description: 'This is a test report to verify real-time functionality',
                priority: Math.random() > 0.5 ? 'high' : 'medium',
                type: 'test'
            };

            const result = await ApiService.createReport(testReport);
            if (result.success) {
                console.log('✅ Test report created:', result.report);
            }
        } catch (error) {
            console.error('❌ Failed to create test report:', error);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>🔥 GreenGrid Real-time Test</h1>

            {/* Controls */}
            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={createTestReport}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginRight: '10px'
                    }}
                >
                    🧪 Create Test Report
                </button>

                <button
                    onClick={loadReports}
                    disabled={isLoading}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    🔄 Refresh Reports
                </button>
            </div>

            {/* Notifications */}
            <div style={{ marginBottom: '20px' }}>
                <h2>🔔 Live Notifications</h2>
                <div style={{
                    maxHeight: '200px',
                    overflowY: 'auto',
                    border: '1px solid #ddd',
                    padding: '10px',
                    backgroundColor: '#f8f9fa'
                }}>
                    {notifications.length === 0 ? (
                        <p>No notifications yet... Create a test report!</p>
                    ) : (
                        notifications.slice(0, 10).map(notification => (
                            <div
                                key={notification.id}
                                style={{
                                    padding: '5px',
                                    margin: '5px 0',
                                    backgroundColor: notification.type === 'error' ? '#f8d7da' :
                                        notification.type === 'success' ? '#d4edda' : '#d1ecf1',
                                    borderRadius: '3px',
                                    fontSize: '14px'
                                }}
                            >
                                {notification.message}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Reports List */}
            <div>
                <h2>📋 Reports ({reports.length})</h2>
                {isLoading ? (
                    <p>Loading reports...</p>
                ) : reports.length === 0 ? (
                    <p>No reports yet. Create one to test real-time updates!</p>
                ) : (
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {reports.map(report => (
                            <div
                                key={report.id}
                                style={{
                                    border: '1px solid #ddd',
                                    padding: '15px',
                                    margin: '10px 0',
                                    borderRadius: '5px',
                                    backgroundColor: '#fff'
                                }}
                            >
                                <h3>{report.title}</h3>
                                <p><strong>Location:</strong> {report.location}</p>
                                <p><strong>Priority:</strong>
                                    <span style={{
                                        color: report.priority === 'critical' ? 'red' :
                                            report.priority === 'high' ? 'orange' : 'green'
                                    }}>
                                        {report.priority}
                                    </span>
                                </p>
                                <p><strong>Status:</strong> {report.status}</p>
                                <p><strong>Created:</strong> {new Date(report.createdAt).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
