# bigtable-kafka-connect

[![Greenkeeper badge](https://badges.greenkeeper.io/nodefluent/bigtable-kafka-connect.svg)](https://greenkeeper.io/)
Kafka Connect connector for Google BigTable

[![Build Status](https://travis-ci.org/nodefluent/bigtable-kafka-connect.svg?branch=master)](https://travis-ci.org/nodefluent/bigtable-kafka-connect)

[![Coverage Status](https://coveralls.io/repos/github/nodefluent/bigtable-kafka-connect/badge.svg?branch=master)](https://coveralls.io/github/nodefluent/bigtable-kafka-connect?branch=master)

## Use API

```
npm install --save bigtable-kafka-connect
```

### bigtable -> kafka

```es6
const { runSourceConnector } = require("bigtable-kafka-connect");
runSourceConnector(config, [], onError).then(config => {
    //runs forever until: config.stop();
});
```

### kafka -> bigtable

```es6
const { runSinkConnector } = require("bigtable-kafka-connect");
runSinkConnector(config, [], onError).then(config => {
    //runs forever until: config.stop();
});
```

### kafka -> bigtable (with custom topic (no source-task topic))

```es6
const { runSinkConnector, ConverterFactory } = require("bigtable-kafka-connect");

const etlFunc = (messageValue, callback) => {

    //type is an example json format field
    if (messageValue.type === "publish") {
        return callback(null, {
            id: messageValue.payload.id,
            name: messageValue.payload.name,
            info: messageValue.payload.info
        });
    }

    if (messageValue.type === "unpublish") {
        return callback(null, null); //null value will cause deletion
    }

    callback(new Error("unknown messageValue.type"));
};

const converter = ConverterFactory.createSinkSchemaConverter(etlFunc);

runSinkConnector(config, [converter], onError).then(config => {
    //runs forever until: config.stop();
});

/*
    this example would be able to store kafka message values
    that look like this (so completely unrelated to messages created by a default SourceTask)
    {
        payload: {
            id: 1,
            name: "first item",
            info: "some info"
        },
        type: "publish"
    }
*/
```

## Use CLI
note: in BETA :seedling:

```
npm install -g bigtable-kafka-connect
```

```
# run source etl: bigtable -> kafka
nkc-bigtable-source --help
```

```
# run sink etl: kafka -> bigtable
nkc-bigtable-sink --help
```

## Config(uration)
```es6
const config = {
    kafka: {
        kafkaHost: "localhost:9092",
        logger: null,
        groupId: "kc-bigtable-test",
        clientName: "kc-bigtable-test-name",
        workerPerPartition: 1,
        options: {
            sessionTimeout: 8000,
            protocol: ["roundrobin"],
            fromOffset: "earliest", //latest
            fetchMaxBytes: 1024 * 100,
            fetchMinBytes: 1,
            fetchMaxWaitMs: 10,
            heartbeatInterval: 250,
            retryMinTimeout: 250,
            requireAcks: 1,
            //ackTimeoutMs: 100,
            //partitionerType: 3
        }
    },
    topic: "sc_test_topic",
    partitions: 1,
    maxTasks: 1,
    pollInterval: 2000,
    produceKeyed: true,
    produceCompressionType: 0,
    connector: {
        batchSize: 500,
        maxPollCount: 500,
        projectId: "bt-project-id",
        dataset: "bt_dataset",
        table: "bt_table",
        columnFamily: "bt_family",
        idColumn: "id"
    },
    http: {
        port: 3149,
        middlewares: []
    },
    enableMetrics: true
};
```

### Links

- [BigTable API Documentation](https://googlecloudplatform.github.io/google-cloud-node/#/docs/bigtable/master/bigtable)
