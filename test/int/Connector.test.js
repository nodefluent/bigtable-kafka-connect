const assert = require('assert');

// const BigTable = require('@google-cloud/bigtable');
// const { Producer } = require('sinek');
// const { SourceRecord } = require('kafka-connect');
// const { runSourceConnector, runSinkConnector, ConverterFactory } = require('./../../index.js');
// const sourceProperties = require('./../source-config.js');
// const sinkProperties = require('./../sink-config.js');


describe('Connector INT', () => {
  it('should add tests', () => assert.ok(true));
  // describe('Source connects and streams', () => {
  //   const bigtable = new BigTable({ projectId: sourceProperties.connector.projectId });
  //   const instance = bigtable.instance(sourceProperties.connector.instanceName);
  //   const table = instance.table(sourceProperties.connector.tableName);
  //   let error = null;
  //   let config = null;
  //
  //   const rows = [
  //     {
  //       key: 1,
  //       value: 'value1',
  //     },
  //     {
  //       key: 2,
  //       value: 'value2',
  //     },
  //     {
  //       key: 3,
  //       value: 'value3',
  //     },
  //   ];
  //
  //   it('should be able to run BigTable source config', (done) => {
  //     const onError = (_error) => {
  //       error = _error;
  //     };
  //     runSourceConnector(sourceProperties, [], onError).then((_config) => {
  //       config = _config;
  //       config.on('record-read', id => console.log(`read: ${id}`));
  //       console.log('initialized');
  //       done();
  //     });
  //   });
  //
  //   it('should be able to await a few pollings', (done) => {
  //     table.insert(rows).then(() => {
  //       console.log('inserted');
  //       setTimeout(() => {
  //         assert.ifError(error);
  //         done();
  //       }, 500);
  //     });
  //   });
  // });
});
