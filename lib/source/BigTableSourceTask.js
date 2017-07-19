const { SourceTask, SourceRecord } = require('kafka-connect');

class BigTableSourceTask extends SourceTask {

  start(properties, callback, parentConfig) {
    this.parentConfig = parentConfig;

    this.properties = properties;
    const { bigTable, table, columnFamily } = this.properties;

    this.bigTable = bigTable;
    this.table = table;
    this.columnFamily = columnFamily;

    this.stats = {
      rowsQueried: 0,
      queryErrors: 0,
    };

    this.parentConfig.on('get-stats', () => {
      this.parentConfig.emit('any-stats', 'bigtable-source', this.stats);
    });

    callback(null);
  }

  poll(callback) {
    this.table.getRows((error, rows) => {
      if (error) {
        this.stats.queryErrors += 1;
        return callback(error);
      }

      this.stats.rowsQueried += rows.length;

      const records = rows.map((row) => {
        const record = new SourceRecord();

        record.key = row.key;

        if (!record.key) {
          throw new Error('db results are missing row number');
        }

        if (this.columnFamily) {
          record.value = row.data[this.columnFamily.id].value;
        } else {
          record.value = row.data.value;
        }

        record.timestamp = new Date().toISOString();
        record.partition = -1;
        record.topic = this.table.id;

        this.parentConfig.emit('record-read', record.key.toString());
        return record;
      });

      return callback(null, records);
    });
  }

  stop() {
    // empty (con is closed by connector)
  }
}

module.exports = BigTableSourceTask;
