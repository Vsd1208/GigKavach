import { apiFetch } from '../lib/api.js';

export async function predictFraud(data) {
  return apiFetch('/api/ml/fraud', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function predictPrice(data) {
  return apiFetch('/api/ml/price', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function predictRisk(data) {
  return apiFetch('/api/ml/risk', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function predictClaim(data) {
  return apiFetch('/api/ml/claim', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function batchPredict(modelType, dataArray) {
  return apiFetch(`/api/ml/batch-predict/${modelType}`, {
    method: 'POST',
    body: JSON.stringify(dataArray)
  });
}

export async function predictWorkerRisk(workerProfile) {
  return apiFetch('/api/ml/worker-risk', {
    method: 'POST',
    body: JSON.stringify(workerProfile)
  });
}

export async function predictWorkerPrice(workerProfile, planId) {
  return apiFetch('/api/ml/worker-price', {
    method: 'POST',
    body: JSON.stringify({ ...workerProfile, planId })
  });
}

export async function checkFraud(claimData) {
  return apiFetch('/api/ml/fraud-check', {
    method: 'POST',
    body: JSON.stringify(claimData)
  });
}

export async function storeWorkerData(workerData) {
  return apiFetch('/api/ml/store-worker', {
    method: 'POST',
    body: JSON.stringify(workerData)
  });
}

export async function getAllWorkers() {
  return apiFetch('/api/ml/workers');
}

export async function getWorkerData(workerId) {
  return apiFetch(`/api/ml/workers/${workerId}`);
}

export async function getWorkerInsights(workerId) {
  return apiFetch(`/api/ml/workers/${workerId}/insights`);
}

export async function getMlAnalytics() {
  return apiFetch('/api/ml/analytics');
}

export async function getMLHealth() {
  return apiFetch('/api/ml/health');
}
