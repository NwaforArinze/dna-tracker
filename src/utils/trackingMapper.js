export const clientTypeMap = {
  walk_in_client: "walkin",
  walk_in_kit_pickup: "walkin_kit_pickup",
  home_service_client: "home_service",
  kit_delivery_client: "kit_delivery",
  partner_collection_center: "partner_collection",
};

export function statusToStep(status) {
  if (!status) return 0;

  const step = parseInt(status.split("-")[0], 10);

  return isNaN(step) ? 0 : step - 1;
}
