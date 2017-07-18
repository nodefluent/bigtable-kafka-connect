#!/usr/bin/env node

const program = require('commander');
const { runSinkConnector } = require('./../index.js');
const pjson = require('./../package.json');
const loadConfig = require('./../config/loadConfig.js');

program
    .version(pjson.version)
    .option('-c, --config [string]', 'Path to Config (optional)')
    .option('-k, --kafka [string]', 'Zookeeper Connection String')
    .option('-g, --group [string]', 'Kafka ConsumerGroup Id')
    .option('-t, --topic [string]', 'Kafka Topic to read from')
    .option('-p, --project_id [string]', 'GCloud project id')
    .option('-b, --table [string]', 'BigTable table name')
    .option('-f, --columnFamily [string]', 'BigTable Column Family Name')
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

if (program.project_id) {
  config.connector.projectId = program.project_id;
}

if (program.tableName) {
  config.connector.tableName = program.tableName;
}

if (program.columnFamilyName) {
  config.connector.columnFamilyName = program.columnFamilyName;
}

runSinkConnector(config, [], console.log.bind(console)).then((sink) => {
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
