export const seedTests = [
  {
    trackingId: "DNA-7X4P9LQ",
    contact: "08031234567", // phone OR email (we just store as text)
    clientType: "walkin", // walkin | kit
    sampleStatus: "collected", // pending | collected | received
    labStatus: "processing", // queued | processing | completed
    resultStatus: "not_ready", // not_ready | ready | released
    deliveryMethod: "pickup", // pickup | shipped | email
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    updatedAt: Date.now() - 1000 * 60 * 20,
  },
  {
    trackingId: "DNA-2M7Q4T1",
    contact: "client@email.com",
    clientType: "kit",
    sampleStatus: "received",
    labStatus: "queued",
    resultStatus: "not_ready",
    deliveryMethod: "shipped",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    updatedAt: Date.now() - 1000 * 60 * 60,
  },
];
