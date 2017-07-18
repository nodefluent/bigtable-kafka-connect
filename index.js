

const BigTableSourceConfig = require('./lib/BigTableSourceConfig.js');
const BigTableSinkConfig = require('./lib/BigTableSinkConfig.js');

const BigTableSourceConnector = require('./lib/source/BigTableSourceConnector.js');
const BigTableSinkConnector = require('./lib/sink/BigTableSinkConnector.js');

const BigTableSourceTask = require('./lib/source/BigTableSourceTask.js');
const BigTableSinkTask = require('./lib/sink/BigTableSinkTask.js');

const JsonConverter = require('./lib/utils/JsonConverter.js');
const ConverterFactory = require('./lib/utils/ConverterFactory.js');

const runSourceConnector = (properties, converters = [], onError = null) => {
  const config = new BigTableSourceConfig(properties,
        BigTableSourceConnector,
        BigTableSourceTask, [JsonConverter].concat(converters));

  if (onError) {
    config.on('error', onError);
  }

  return config.run().then(() => config);
};

const runSinkConnector = (properties, converters = [], onError = null) => {
  const config = new BigTableSinkConfig(properties,
        BigTableSinkConnector,
        BigTableSinkTask, [JsonConverter].concat(converters));

  if (onError) {
    config.on('error', onError);
  }

  return config.run().then(() => config);
};

module.exports = {
  runSourceConnector,
  runSinkConnector,
  ConverterFactory,
};
