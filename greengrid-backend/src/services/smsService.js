// src/services/smsService.js
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const INFOBIP_BASE_URL = 'https://api.infobip.com';
const API_KEY = process.env.INFOBIP_API_KEY;

export const sendSMS = async (phoneNumber, message) => {
    try {
        console.log(`Sending SMS to ${phoneNumber}: ${message}`);

        const response = await axios.post(
            `${INFOBIP_BASE_URL}/sms/2/text/advanced`,
            {
                messages: [{
                    from: "GreenGrid",
                    destinations: [{
                        to: phoneNumber
                    }],
                    text: message
                }]
            },
            {
                headers: {
                    'Authorization': `App ${API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('SMS sent successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('SMS Error:', error.response?.data || error.message);
        throw new Error(`Failed to send SMS: ${error.response?.data?.requestError?.serviceException?.text || error.message}`);
    }
};

export const sendEmergencyAlert = async (reportId, issueType, location, priority, contactPhone) => {
    const emergencyMessage = `🚨 EMERGENCY REPORT
Report ID: ${reportId}
Type: ${issueType}
Location: ${location}
Priority: ${priority}
Contact: ${contactPhone}

Response team notified. Keep this ID for tracking.`;

    // Send to emergency team
    await sendSMS(process.env.EMERGENCY_PHONE, emergencyMessage);

    // Send confirmation to reporter
    const confirmationMessage = `✅ Your emergency report ${reportId} has been received. Our team will respond ASAP. Keep this ID for reference.`;
    await sendSMS(contactPhone, confirmationMessage);

    return true;
};
