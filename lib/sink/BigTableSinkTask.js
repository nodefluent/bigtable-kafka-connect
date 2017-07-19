const { SinkTask } = require('kafka-connect');

class BigTableSinkTask extends SinkTask {

  start(properties, callback, parentConfig) {
    this.parentConfig = parentConfig;
    this.properties = properties;
    const { bigTable, table, columnFamily } = this.properties;

    this.bigTable = bigTable;
    this.table = table;
    this.columnFamily = columnFamily;

    this.stats = {
      batchRuns: 0,
      rowsInserted: 0,
      insertErrors: 0,
    };

    this.parentConfig.on('get-stats', () => {
      this.parentConfig.emit('any-stats', 'bigtable-sink', this.stats);
    });

    callback(null);
  }

  async putRecords(records) {
    const rows = records.map((record) => {
      const key = record.key ? record.key.toString() : 'null';
      this.parentConfig.emit('model-upsert', key);
      return { key, data: { [this.columnFamily.familyName]: record.value } };
    });

    await this.table.insert(rows);
  }

  put(records, callback) {
    this.putRecords(records)
      .then(() => callback(null))
      .catch(error => callback(error));
  }

  stop() {
    // empty (con is closed by connector)
  }

}

module.exports = BigTableSinkTask;
