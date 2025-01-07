const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { NodeSDK } = require('@opentelemetry/sdk-node');

new NodeSDK({
  instrumentations: [getNodeAutoInstrumentations()],
}).start();
