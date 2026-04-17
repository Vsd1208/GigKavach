// ML Service for handling ML-related logic
import axios from 'axios';
import { store } from '../store.js';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5000';

class MLService {
    async getPrediction(modelType, data) {
        try {
            const response = await axios.post(`${ML_SERVICE_URL}/predict/${modelType}`, data);
            return response.data;
        } catch (error) {
            console.error(`ML prediction failed for ${modelType}:`, error.message);
            throw new Error(`ML prediction failed: ${error.message}`);
        }
    }

    async batchPredict(modelType, dataArray) {
        try {
            const response = await axios.post(`${ML_SERVICE_URL}/batch-predict/${modelType}`, dataArray);
            return response.data;
        } catch (error) {
            console.error(`Batch prediction failed for ${modelType}:`, error.message);
            throw new Error(`Batch prediction failed: ${error.message}`);
        }
    }

    async storeWorkerData(workerData) {
        try {
            const response = await axios.post(`${ML_SERVICE_URL}/store-worker`, workerData);
            return response.data;
        } catch (error) {
            console.error('Failed to store worker data:', error.message);
            throw new Error(`Failed to store worker data: ${error.message}`);
        }
    }

    async getWorkerData(workerId) {
        try {
            const response = await axios.get(`${ML_SERVICE_URL}/workers/${workerId}`);
            return response.data;
        } catch (error) {
            console.error('Failed to retrieve worker data:', error.message);
            throw new Error(`Failed to retrieve worker data: ${error.message}`);
        }
    }

    async getAllWorkers() {
        try {
            const response = await axios.get(`${ML_SERVICE_URL}/workers`);
            return response.data;
        } catch (error) {
            console.error('Failed to retrieve workers:', error.message);
            throw new Error(`Failed to retrieve workers: ${error.message}`);
        }
    }

    async getAnalytics() {
        try {
            const response = await axios.get(`${ML_SERVICE_URL}/analytics`);
            return response.data;
        } catch (error) {
            console.error('Failed to retrieve ML analytics:', error.message);
            throw new Error(`Failed to retrieve ML analytics: ${error.message}`);
        }
    }

    async getWorkerInsights(workerId) {
        try {
            const response = await axios.get(`${ML_SERVICE_URL}/workers/${workerId}/insights`);
            return response.data;
        } catch (error) {
            console.error('Failed to retrieve worker insights:', error.message);
            throw new Error(`Failed to retrieve worker insights: ${error.message}`);
        }
    }

    async predictRisk(workerProfile) {
        try {
            const riskData = {
                age: workerProfile.age,
                gig_type: workerProfile.gig_type || 'Delivery',
                monthly_income: workerProfile.monthly_income || 30000,
                work_hours_per_week: workerProfile.work_hours_per_week || 40,
                night_shift_ratio: workerProfile.night_shift_ratio || 0.3,
                vehicle_age_years: workerProfile.vehicle_age_years || 5,
                traffic_violations: workerProfile.traffic_violations || 0,
                health_score: workerProfile.health_score || 70,
                city_tier: workerProfile.city_tier || 2,
                coverage_gap_days: workerProfile.coverage_gap_days || 30
            };
            
            const response = await this.getPrediction('risk', riskData);
            return {
                riskScore: response.risk[0],
                probability: response.probability?.[0] || null
            };
        } catch (error) {
            console.error('Risk prediction error:', error.message);
            return { riskScore: 0.5, probability: null };
        }
    }

    async predictPrice(workerProfile, planId) {
        try {
            const priceData = {
                age: workerProfile.age,
                gig_platform: workerProfile.gig_platform || 'Blinkit',
                monthly_income: workerProfile.monthly_income || 30000,
                work_hours_per_week: workerProfile.work_hours_per_week || 40,
                years_experience: workerProfile.years_experience || 3,
                health_condition: workerProfile.health_condition || 'Fair',
                coverage_type: workerProfile.coverage_type || 'Accident Only',
                location_risk_score: workerProfile.location_risk_score || 5.0,
                num_dependents: workerProfile.num_dependents || 1,
                past_accidents: workerProfile.past_accidents || 0,
                city_tier: workerProfile.city_tier || 2
            };
            
            const response = await this.getPrediction('price', priceData);
            return {
                estimatedPrice: response.price[0],
                confidence: response.probability?.[0] || null
            };
        } catch (error) {
            console.error('Price prediction error:', error.message);
            return { estimatedPrice: 99, confidence: null };
        }
    }

    async predictFraud(claimData) {
        try {
            const fraudData = {
                age: claimData.age || 35,
                policy_duration_days: claimData.policy_duration_days || 365,
                claim_amount: claimData.claim_amount || 10000,
                monthly_income: claimData.monthly_income || 30000,
                num_claims_past_year: claimData.num_claims_past_year || 0,
                claim_to_income_ratio: claimData.claim_to_income_ratio || 0.5,
                response_time_hours: claimData.response_time_hours || 24,
                inconsistency_score: claimData.inconsistency_score || 0.1,
                ip_location_mismatch: claimData.ip_location_mismatch || 0,
                document_auth_score: claimData.document_auth_score || 0.8,
                previous_fraud_flag: claimData.previous_fraud_flag || 0
            };
            
            const response = await this.getPrediction('fraud', fraudData);
            return {
                isFraud: response.fraud[0],
                confidence: response.probability?.[0] || null
            };
        } catch (error) {
            console.error('Fraud prediction error:', error.message);
            return { isFraud: 0, confidence: null };
        }
    }

    async predictClaim(workerClaim) {
        try {
            const claimData = {
                age: workerClaim.age || 35,
                gig_platform: workerClaim.gig_platform || 'Blinkit',
                monthly_income: workerClaim.monthly_income || 30000,
                work_hours_per_week: workerClaim.work_hours_per_week || 40,
                policy_type: workerClaim.policy_type || 'Standard',
                claim_type: workerClaim.claim_type || 'Vehicle Damage',
                claim_amount: workerClaim.claim_amount || 5000,
                days_since_policy_start: workerClaim.days_since_policy_start || 30,
                previous_claims: workerClaim.previous_claims || 0,
                incident_severity: workerClaim.incident_severity || 'Low'
            };
            
            const response = await this.getPrediction('claim', claimData);
            return {
                claimLikelihood: response.claim[0],
                probability: response.probability?.[0] || null
            };
        } catch (error) {
            console.error('Claim prediction error:', error.message);
            return { claimLikelihood: 0, probability: null };
        }
    }

    async checkHealth() {
        try {
            const response = await axios.get(`${ML_SERVICE_URL}/health`);
            return response.data;
        } catch (error) {
            return { status: 'unhealthy', error: error.message };
        }
    }

    formatWorkerDataForStorage(workerProfile) {
        const workHours = workerProfile.work_hours_per_week
            || workerProfile.avgDailyHours * (workerProfile.shiftPattern === 'Part Time' ? 5 : 6)
            || 48;
        const zoneRisk = workerProfile.location_risk_score
            || (workerProfile.zoneRiskScore ? Number((workerProfile.zoneRiskScore * 10).toFixed(2)) : 5.5);

        return {
            worker_id: workerProfile.id || `W${Date.now()}`,
            name: workerProfile.name || 'New Partner',
            mobile: workerProfile.mobile || '',
            zone_id: workerProfile.zoneId || '',
            zone_name: workerProfile.zoneName || '',
            age: workerProfile.age || 30,
            gig_type: workerProfile.gig_type || workerProfile.platform || 'Delivery',
            gig_platform: workerProfile.gig_platform || workerProfile.platform || 'Zepto',
            monthly_income: workerProfile.monthly_income || 30000,
            work_hours_per_week: workHours,
            health_condition: workerProfile.health_condition || 'Fair',
            health_score: workerProfile.health_score || 72,
            location_risk_score: zoneRisk,
            city_tier: workerProfile.city_tier || 1,
            years_experience: workerProfile.years_experience || 2,
            num_dependents: workerProfile.num_dependents || 0,
            past_accidents: workerProfile.past_accidents || 0,
            traffic_violations: workerProfile.traffic_violations || 0,
            vehicle_age_years: workerProfile.vehicle_age_years || 4,
            coverage_gap_days: workerProfile.coverage_gap_days || 0,
            night_shift_ratio: workerProfile.night_shift_ratio || 0.25,
            coverage_type: workerProfile.coverage_type || 'Accident Only',
            shift_pattern: workerProfile.shiftPattern || 'Full Day',
            member_since: workerProfile.memberSince || new Date().toISOString().slice(0, 10),
            upi_id: workerProfile.upiId || '',
            timestamp: new Date().toISOString()
        };
    }
}

export default new MLService();
