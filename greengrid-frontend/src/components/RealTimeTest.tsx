import React, { useState, useEffect } from 'react';

// 🔔 Add notification interfaces
interface Report {
    id: string;
    title: string;
    location: string;
    description: string;
    priority: string;
    status: string;
    type: string;
    createdAt: string;
    updatedAt: string;
}

interface Notification {
    id: number;
    type: 'success' | 'error' | 'info';
    message: string;
}

interface BackendHealth {
    success: boolean;
    version?: string;
    database?: string;
    realTime?: string;
    error?: string;
}

// 🔔 Simple Notification Service (built-in)
class SimpleNotificationService {
    static async requestPermission() {
        if (!('Notification' in window)) {
            console.log('❌ Browser notifications not supported');
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    static showNotification(title: string, options: NotificationOptions = {}) {
        if (Notification.permission !== 'granted') {
            console.log('❌ No notification permission');
            return;
        }

        const notification = new Notification(title, {
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            ...options
        });

        // Auto close after 5 seconds
        setTimeout(() => notification.close(), 5000);

        // Handle click - focus window
        notification.onclick = () => {
            window.focus();
            notification.close();
        };

        return notification;
    }
}

export const RealTimeTest: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [backendHealth, setBackendHealth] = useState<BackendHealth | null>(null);
    const [notificationEnabled, setNotificationEnabled] = useState<boolean>(false);

    // Load initial reports and check backend health
    useEffect(() => {
        checkBackendHealth();
        loadReports();
        checkNotificationPermission();
    }, []);

    const checkNotificationPermission = () => {
        if ('Notification' in window) {
            setNotificationEnabled(Notification.permission === 'granted');
        }
    };

    const enableNotifications = async () => {
        const granted = await SimpleNotificationService.requestPermission();
        setNotificationEnabled(granted);

        if (granted) {
            SimpleNotificationService.showNotification(
                '🎉 GreenGrid Notifications Enabled!',
                { body: 'You will now receive alerts for important reports.' }
            );
        }
    };

    const testNotification = () => {
        SimpleNotificationService.showNotification(
            '🧪 Test Notification',
            { body: 'This is a test notification from GreenGrid!' }
        );
    };

    const checkBackendHealth = async (): Promise<void> => {
        try {
            const response = await fetch('http://localhost:5000/api/health');
            const result: BackendHealth = await response.json();
            setBackendHealth(result);
        } catch (error) {
            console.error('Backend health check failed:', error);
            setBackendHealth({ success: false, error: 'Backend not reachable' });
        }
    };

    const loadReports = async (): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/reports');
            const result = await response.json();
            if (result.success) {
                setReports(result.reports);
            }
        } catch (error) {
            console.error('Failed to load reports:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Create test report with push notifications
    const createTestReport = async (): Promise<void> => {
        try {
            const priorities = ['low', 'medium', 'high', 'critical'];
            const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];

            const testReport = {
                title: `🧪 Test Report ${Date.now()}`,
                location: 'Test Location, Colombo',
                description: 'This is a test report to verify real-time functionality',
                priority: randomPriority,
                type: 'test'
            };

            const response = await fetch('http://localhost:5000/api/reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testReport)
            });

            const result = await response.json();
            if (result.success) {
                console.log('✅ Test report created:', result.report);

                // 🔔 SHOW PUSH NOTIFICATION
                if (notificationEnabled) {
                    const priorityEmojis = {
                        'critical': '🚨',
                        'high': '⚠️',
                        'medium': '📋',
                        'low': '📝'
                    };

                    const emoji = priorityEmojis[result.report.priority as keyof typeof priorityEmojis] || '📋';

                    SimpleNotificationService.showNotification(
                        `${emoji} New ${result.report.priority.toUpperCase()} Priority Report`,
                        {
                            body: `${result.report.title}\n📍 ${result.report.location}`,
                            tag: `report-${result.report.id}`
                        }
                    );
                }

                setNotifications(prev => [...prev, {
                    id: Date.now(),
                    type: 'success',
                    message: `📋 Created: ${result.report.title} (${result.report.priority}) ${notificationEnabled ? '🔔' : ''}`
                }]);

                // Refresh reports list
                await loadReports();
            }
        } catch (error) {
            console.error('❌ Failed to create test report:', error);
            setNotifications(prev => [...prev, {
                id: Date.now(),
                type: 'error',
                message: '❌ Failed to create report - check backend connection'
            }]);
        }
    };

    const handleMouseOver = (e: React.MouseEvent<HTMLButtonElement>, color: string) => {
        e.currentTarget.style.backgroundColor = color;
    };

    const handleMouseOut = (e: React.MouseEvent<HTMLButtonElement>, color: string) => {
        e.currentTarget.style.backgroundColor = color;
    };

    return (
        <div style={{
            padding: '20px',
            fontFamily: 'Arial, sans-serif',
            maxWidth: '1200px',
            margin: '0 auto'
        }}>
            <h1 style={{ color: '#2d5a27', marginBottom: '20px' }}>
                🔥 GreenGrid Real-time Test
            </h1>

            {/* Backend Status */}
            <div style={{
                marginBottom: '20px',
                padding: '15px',
                backgroundColor: backendHealth?.success ? '#d4edda' : '#f8d7da',
                border: `1px solid ${backendHealth?.success ? '#c3e6cb' : '#f5c2c7'}`,
                borderRadius: '5px'
            }}>
                <h3 style={{ margin: '0 0 10px 0' }}>🖥️ Backend Status</h3>
                {backendHealth ? (
                    <div>
                        <p>
                            <strong>Status:</strong> {backendHealth.success ? '✅ Connected' : '❌ Disconnected'}
                        </p>
                        {backendHealth.success && (
                            <>
                                <p><strong>Version:</strong> {backendHealth.version}</p>
                                <p><strong>Database:</strong> {backendHealth.database}</p>
                                <p><strong>Real-time:</strong> {backendHealth.realTime || 'Not available'}</p>
                            </>
                        )}
                        {!backendHealth.success && (
                            <p><strong>Error:</strong> {backendHealth.error}</p>
                        )}
                    </div>
                ) : (
                    <p>Checking backend connection...</p>
                )}
            </div>

            {/* 🔔 PUSH NOTIFICATIONS SECTION */}
            <div style={{
                marginBottom: '20px',
                padding: '15px',
                backgroundColor: notificationEnabled ? '#d4edda' : '#fff3cd',
                border: `1px solid ${notificationEnabled ? '#c3e6cb' : '#ffeeba'}`,
                borderRadius: '5px'
            }}>
                <h3 style={{ margin: '0 0 10px 0' }}>🔔 Push Notifications</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <p>
                        <strong>Status:</strong>
                        <span style={{
                            color: notificationEnabled ? '#28a745' : '#856404',
                            marginLeft: '5px',
                            fontWeight: 'bold'
                        }}>
                            {notificationEnabled ? '✅ Enabled' : '⚠️ Disabled'}
                        </span>
                    </p>

                    {!notificationEnabled && (
                        <button
                            onClick={enableNotifications}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            🔔 Enable Notifications
                        </button>
                    )}

                    {notificationEnabled && (
                        <button
                            onClick={testNotification}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            🧪 Test Notification
                        </button>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={createTestReport}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginRight: '10px',
                        fontSize: '16px'
                    }}
                    onMouseOver={(e) => handleMouseOver(e, '#0056b3')}
                    onMouseOut={(e) => handleMouseOut(e, '#007bff')}
                >
                    🧪 Create Test Report {notificationEnabled ? '🔔' : ''}
                </button>

                <button
                    onClick={loadReports}
                    disabled={isLoading}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginRight: '10px',
                        fontSize: '16px',
                        opacity: isLoading ? 0.6 : 1
                    }}
                    onMouseOver={(e) => !isLoading && handleMouseOver(e, '#1e7e34')}
                    onMouseOut={(e) => !isLoading && handleMouseOut(e, '#28a745')}
                >
                    🔄 {isLoading ? 'Loading...' : 'Refresh Reports'}
                </button>

                <button
                    onClick={checkBackendHealth}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: '#17a2b8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                    onMouseOver={(e) => handleMouseOver(e, '#117a8b')}
                    onMouseOut={(e) => handleMouseOut(e, '#17a2b8')}
                >
                    🔍 Check Backend
                </button>
            </div>

            {/* Rest of your existing code stays the same... */}
            {/* Notifications section */}
            <div style={{ marginBottom: '20px' }}>
                <h2 style={{ color: '#2d5a27' }}>🔔 Live Notifications</h2>
                <div style={{
                    maxHeight: '200px',
                    overflowY: 'auto',
                    border: '1px solid #ddd',
                    padding: '15px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '5px'
                }}>
                    {notifications.length === 0 ? (
                        <p style={{ color: '#6c757d', fontStyle: 'italic' }}>
                            No notifications yet... Create a test report!
                        </p>
                    ) : (
                        notifications.slice(0, 10).map(notification => (
                            <div
                                key={notification.id}
                                style={{
                                    padding: '8px 12px',
                                    margin: '8px 0',
                                    backgroundColor: notification.type === 'error' ? '#f8d7da' :
                                        notification.type === 'success' ? '#d1ecf1' : '#d4edda',
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                    borderLeft: `4px solid ${notification.type === 'error' ? '#dc3545' :
                                        notification.type === 'success' ? '#17a2b8' : '#28a745'}`
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
                <h2 style={{ color: '#2d5a27' }}>📋 Reports ({reports.length})</h2>
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <p>Loading reports...</p>
                    </div>
                ) : reports.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '5px',
                        border: '1px solid #ddd'
                    }}>
                        <p style={{ color: '#6c757d', fontSize: '18px' }}>No reports yet.</p>
                        <p style={{ color: '#6c757d' }}>Create one to test real-time updates!</p>
                    </div>
                ) : (
                    <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        {reports.map((report) => (
                            <div
                                key={report.id}
                                style={{
                                    border: '1px solid #ddd',
                                    padding: '20px',
                                    margin: '15px 0',
                                    borderRadius: '8px',
                                    backgroundColor: '#fff',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                            >
                                <h3 style={{
                                    margin: '0 0 10px 0',
                                    color: '#2d5a27',
                                    fontSize: '18px'
                                }}>
                                    {report.title}
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <p><strong>📍 Location:</strong> {report.location}</p>
                                    <p>
                                        <strong>📊 Priority:</strong>
                                        <span style={{
                                            color: report.priority === 'critical' ? '#dc3545' :
                                                report.priority === 'high' ? '#fd7e14' :
                                                    report.priority === 'medium' ? '#ffc107' : '#28a745',
                                            fontWeight: 'bold',
                                            marginLeft: '5px'
                                        }}>
                                            {report.priority?.toUpperCase()}
                                        </span>
                                    </p>
                                    <p>
                                        <strong>🔄 Status:</strong>
                                        <span style={{
                                            backgroundColor: report.status === 'open' ? '#fff3cd' : '#d1ecf1',
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            marginLeft: '5px',
                                            fontWeight: 'bold'
                                        }}>
                                            {report.status?.toUpperCase()}
                                        </span>
                                    </p>
                                    <p>
                                        <strong>📅 Created:</strong> {new Date(report.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                {report.description && (
                                    <p style={{
                                        marginTop: '10px',
                                        padding: '10px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '4px',
                                        fontStyle: 'italic'
                                    }}>
                                        <strong>Description:</strong> {report.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
