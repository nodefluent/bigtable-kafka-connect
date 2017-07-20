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
      const value = record.value;
      // delete row if value is null
      if (!value || value === 'null') {
        this.parentConfig.emit('model-delete', key);
        return { method: 'delete', key };
      }
      this.parentConfig.emit('model-upsert', key);
      return { method: 'insert', key, data: { [this.columnFamily.familyName]: { value } } };
    });

    await this.table.mutate(rows);
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
