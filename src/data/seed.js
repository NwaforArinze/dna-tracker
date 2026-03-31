export const seedTests = [
  {
    trackingId: "DNA-7X4P9LQ",
    serialNumber: "SMA2500",
    scenario: "walkin",
    currentStep: 2,
    stepTimestamps: [
      Date.now(),
      Date.now(),
      Date.now(),
      null,
      null,
      null,
      null,
      null,
      null,
    ],

    createdAt: Date.now() - 1000 * 60 * 60 * 48,
    updatedAt: Date.now() - 1000 * 60 * 20,
  },

  {
    trackingId: "DNA-2M7Q4T1",
    serialNumber: "SMA2501",
    scenario: "walkin",
    currentStep: 2,

    stepTimestamps: [
      Date.now() - 1000 * 60 * 60 * 72,
      Date.now() - 1000 * 60 * 60 * 50,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],

    createdAt: Date.now() - 1000 * 60 * 60 * 72,
    updatedAt: Date.now() - 1000 * 60 * 60,
  },
];
