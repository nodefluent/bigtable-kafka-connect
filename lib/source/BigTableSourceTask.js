const { SourceTask, SourceRecord } = require('kafka-connect');

class BigTableSourceTask extends SourceTask {

  start(properties, callback, parentConfig) {
    this.parentConfig = parentConfig;

    this.properties = properties;
    const { bigTable, table, columnFamily, lastSourceId } = this.properties;

    this.bigTable = bigTable;
    this.table = table;
    this.columnFamily = columnFamily;
    this.getRowsLimit = this.parentConfig.connector.properties.getRowsLimit;
    this.lastSourceId = lastSourceId;

    this.stats = {
      rowsQueried: 0,
      queryErrors: 0,
    };

    this.parentConfig.on('get-stats', () => {
      this.parentConfig.emit('any-stats', 'bigtable-source', this.stats);
    });

    callback(null);
  }

  async poll(callback) {
    try {
      const options = {
        decode: true,
        limit: this.getRowsLimit,
        start: this.lastSourceId,
      };

      const [rows] = await this.table.getRows(options);
      if (this.lastSourceId) {
        rows.shift();
      }
      this.stats.rowsQueried += rows.length;
      if (rows.length > 0) {
        this.lastSourceId = rows[rows.length - 1].id;
      }

      const records = rows.map((row) => {
        const record = new SourceRecord();

        record.key = row.id;
        if (!record.key) {
          throw new Error('db results are missing row number');
        }

        record.value = row.data[this.columnFamily.familyName].value[0].value;
        record.timestamp = new Date().toISOString();
        record.partition = -1;
        record.topic = this.table.id;

        this.parentConfig.emit('record-read', record.key.toString());
        return record;
      });

      callback(null, records);
    } catch (error) {
      this.stats.queryErrors += 1;
      callback(error);
    }
  }

  stop() {
    // empty (con is closed by connector)
  }
}

module.exports = BigTableSourceTask;
