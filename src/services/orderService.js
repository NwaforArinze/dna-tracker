import { apiRequest } from "./api";

export async function getOrderByTrackingId(trackingId) {
  return apiRequest(`/order/by-track-id/${trackingId}`);
}
export function statusToStep(status) {
  if (!status) return 0;

  const match = status.match(/^(\d+)-/);

  if (!match) return 0;

  return Number(match[1]) - 1;
}
export function mapOrderToTracker(order) {
  return {
    trackingId: order.tracking_id,

    scenario: order.client_type,

    currentStep: statusToStep(order.status),

    sampleStatus: order.sample_status,

    labStatus: order.lab_status,

    resultStatus: order.result_status,
  };
}
