

const { SourceConfig } = require('kafka-connect');

class BigTableSourceConfig extends SourceConfig {
  run() {
    return super.run();
  }
}

module.exports = BigTableSourceConfig;
