// greengrid-backend/services/aiAnalysis.js
const axios = require('axios');

class AIAnalysisService {
    constructor() {
        this.openaiApiKey = process.env.OPENAI_API_KEY;
    }

    // Analyze waste image using OpenAI Vision API
    async analyzeWasteImage(imageUrl) {
        try {
            if (!this.openaiApiKey) {
                console.warn('⚠️ OpenAI API key not configured, using mock analysis');
                return this.getMockAnalysis();
            }

            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-4-vision-preview',
                    messages: [
                        {
                            role: 'user',
                            content: [
                                {
                                    type: 'text',
                                    text: `Analyze this waste/garbage image and provide:
                  1. Waste type (organic, plastic, metal, glass, hazardous, mixed, other)
                  2. Severity level (low, medium, high, critical)
                  3. Environmental impact (1-10 scale)
                  4. Recommended action
                  5. Estimated volume (small, medium, large, massive)
                  
                  Respond in JSON format only.`
                                },
                                {
                                    type: 'image_url',
                                    image_url: {
                                        url: imageUrl
                                    }
                                }
                            ]
                        }
                    ],
                    max_tokens: 500
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.openaiApiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const analysis = JSON.parse(response.data.choices[0].message.content);
            console.log('🤖 AI Analysis completed:', analysis);
            return analysis;

        } catch (error) {
            console.error('❌ AI Analysis failed:', error);
            return this.getMockAnalysis();
        }
    }

    // Mock analysis for testing without OpenAI API
    getMockAnalysis() {
        const wasteTypes = ['organic', 'plastic', 'metal', 'glass', 'hazardous', 'mixed'];
        const severities = ['low', 'medium', 'high', 'critical'];
        const volumes = ['small', 'medium', 'large', 'massive'];

        return {
            wasteType: wasteTypes[Math.floor(Math.random() * wasteTypes.length)],
            severityLevel: severities[Math.floor(Math.random() * severities.length)],
            environmentalImpact: Math.floor(Math.random() * 10) + 1,
            recommendedAction: 'Immediate collection and proper disposal required',
            estimatedVolume: volumes[Math.floor(Math.random() * volumes.length)],
            confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
            isAiGenerated: false
        };
    }
}

module.exports = new AIAnalysisService();
