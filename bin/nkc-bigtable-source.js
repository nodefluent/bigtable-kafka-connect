#!/usr/bin/env node

const program = require('commander');
const { runSourceConnector } = require('./../index.js');
const pjson = require('./../package.json');
const loadConfig = require('./../config/loadConfig.js');

program
  .version(pjson.version)
  .option('-c, --config [string]', 'Path to Config (alternatively)')
  .option('-k, --kafka [string]', 'Zookeeper Connection String')
  .option('-n, --name [string]', 'Kafka Client Name')
  .option('-t, --topic [string]', 'Kafka Topic to Produce to')
  .option('-a, --partitions [integer]', 'Amount of Kafka Topic Partitions')
  .option('-p, --project_id [string]', 'GCloud project id')
  .option('-b, --tableName [string]', 'BigTable table name')
  .option('-f, --columnFamilyName [string]', 'BigTable Column Family Name')
  .parse(process.argv);

const config = loadConfig(program.config);

if (program.kafka) {
  config.kafka.zkConStr = program.kafka;
}

if (program.name) {
  config.kafka.clientName = program.name;
}

if (program.topic) {
  config.topic = program.topic;
}

if (program.partitions) {
  config.partitions = program.partitions;
}

if (program.project_id) {
  config.connector.project_id = program.project_id;
}

if (program.tableName) {
  config.connector.tableName = program.tableName;
}

if (program.columnFamilyName) {
  config.connector.columnFamilyName = program.columnFamilyName;
}

runSourceConnector(config, [], console.log.bind(console)).then((sink) => {
  const exit = (isExit = false) => {
    sink.stop();
    if (!isExit) {
      process.exit();
    }
  };

  process.on('SIGINT', () => {
    exit(false);
  });

  process.on('exit', () => {
    exit(true);
  });
});
