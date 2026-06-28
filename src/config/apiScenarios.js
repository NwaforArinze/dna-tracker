export const CLIENT_TYPE_MAP = {
  walkin: "walk_in_client",
  walkin_kit_pickup: "walk_in_client_kit_pickup",
  home_service: "home_service_client",
  kit_delivery: "kit_delivery_client",
  partner_collection: "sample_collection_center",
};

export function buildStatus(stepIndex, scenarioKey) {
  const statuses = {
    walkin: [
      "1-appointment_scheduled",
      "2-forms_completed",
      "3-payment_confirmed",
      "4-sample_collected",
      "5-internal_qc_completed",
      "6-sample_dispatched_to_laboratory",
      "7-sample_received_by_laboratory",
      "8-laboratory_analysis_in_progress",
      "9-laboratory_analysis_completed",
      "10-result_sent_to_provided_email",
    ],

    walkin_kit_pickup: [
      "1-payment_confirmed",
      "2-kit_picked_up_by_client",
      "3-sample_collection_instructions_provided",
      "4-client_returned_completed_kit",
      "5-sample_received_and_verified",
      "6-internal_qc_completed",
      "7-sample_dispatched_to_laboratory",
      "8-sample_received_by_laboratory",
      "9-laboratory_analysis_in_progress",
      "10-laboratory_analysis_completed",
      "11-result_sent_to_provided_email",
    ],

    home_service: [
      "1-payment_confirmed",
      "2-home_service_appointment_scheduled",
      "3-sample_collected_at_client_location",
      "4-internal_qc_completed",
      "5-sample_dispatched_to_laboratory",
      "6-sample_received_by_laboratory",
      "7-laboratory_analysis_in_progress",
      "8-laboratory_analysis_completed",
      "9-result_sent_to_provided_email",
    ],

    kit_delivery: [
      "1-payment_confirmed",
      "2-logistics_notified_to_dispatch_kit",
      "3-sample_collection_instructions_sent",
      "4-kit_delivered_to_client",
      "5-client_returned_completed_kit",
      "6-sample_received_and_verified",
      "7-internal_qc_completed",
      "8-sample_dispatched_to_laboratory",
      "9-sample_received_by_laboratory",
      "10-laboratory_analysis_in_progress",
      "11-laboratory_analysis_completed",
      "12-result_sent_to_provided_email",
    ],

    partner_collection: [
      "1-payment_confirmed",
      "2-appointment_scheduled_at_partner_center",
      "3-appointment_details_shared_with_partner_center",
      "4-sample_collected_at_partner_center",
      "5-logistics_notified_for_pickup",
      "6-sample_delivered_to_gbagada_office",
      "7-internal_qc_completed",
      "8-sample_dispatched_to_laboratory",
      "9-sample_received_by_laboratory",
      "10-laboratory_analysis_in_progress",
      "11-laboratory_analysis_completed",
      "12-result_sent_to_provided_email",
    ],
  };

  return statuses[scenarioKey]?.[stepIndex] || null;
}

export const API_TO_SCENARIO_MAP = {
  walk_in_client: "walkin",
  walk_in_client_kit_pickup: "walkin_kit_pickup",
  home_service_client: "home_service",
  kit_delivery_client: "kit_delivery",
  sample_collection_center: "partner_collection",
};
