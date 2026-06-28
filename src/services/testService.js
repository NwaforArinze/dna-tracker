import { apiRequest } from "./api";
import { CLIENT_TYPE_MAP, buildStatus } from "../config/apiScenarios";

export async function getOrderByTrackingId(trackingId) {
  return await apiRequest(`/order/by-track-id/${trackingId}`);
}

export async function createOrderTracking(payload) {
  return await apiRequest("/order", {
    method: "POST",
    body: JSON.stringify({
      client_contact: payload.contact,
      client_type: CLIENT_TYPE_MAP[payload.scenario],
      status: buildStatus(0, payload.scenario),
    }),
  });
}

export async function updateOrderTracking(id, payload) {
  return await apiRequest(`/order/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function getAllOrderTrackings() {
  return await apiRequest("/order");
}

export async function getOrderById(id) {
  return await apiRequest(`/order/${id}`);
}
