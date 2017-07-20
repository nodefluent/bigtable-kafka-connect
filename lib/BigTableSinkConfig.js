

const { SinkConfig } = require('kafka-connect');

class BigTableSinkConfig extends SinkConfig {
  run() {
    return super.run();
  }
}

module.exports = BigTableSinkConfig;
