
const config = {
  kafka: {
    kafkaHost: 'localhost:9092',
    logger: null,
    groupId: 'kc-bigtable-group',
    clientName: 'kc-bigtable-client',
    workerPerPartition: 1,
    options: {
      sessionTimeout: 8000,
      protocol: ['roundrobin'],
      fromOffset: 'earliest', // latest
      fetchMaxBytes: 1024 * 100,
      fetchMinBytes: 1,
      fetchMaxWaitMs: 10,
      heartbeatInterval: 250,
      retryMinTimeout: 250,
      autoCommit: true,
      autoCommitIntervalMs: 1000,
      requireAcks: 1,
      //ackTimeoutMs: 100,
      //partitionerType: 3
    },
  },
  topic: 'bq_table_topic',
  partitions: 1,
  maxTasks: 1,
  pollInterval: 250,
  produceKeyed: true,
  produceCompressionType: 0,
  connector: {
    projectId: 'bt-project-id',
    instanceName: 'bt-test-instance',
    tableName: 'bt_test_table',
  },
  http: {
    port: 3149,
    middlewares: [],
  },
  enableMetrics: true,
};

module.exports = config;
