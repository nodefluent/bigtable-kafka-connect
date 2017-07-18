

const { SinkConnector } = require('kafka-connect');
const BigTable = require('@google-cloud/bigtable');

class BigTableSinkConnector extends SinkConnector {

    /**
     * @param  {Object}   properties
     * @param  {Number}   properties.projectId
     * @param  {String}   properties.instanceName
     * @param  {String}   properties.tableName
     * @param  {String}   [properties.columnFamilyName]
     * @param  {Function} callback
     */
  async start(properties, callback) {
    this.properties = properties;

    try {
      this.bigTable = new BigTable({ projectId: this.properties.projectId });
      this.instance = this.bigTable.instance(this.properties.instanceName);
      const instanceExists = await this.instance.exists();
      if (!instanceExists || !instanceExists[0]) {
        await this.instance.create();
      }

      this.table = this.instance.table(this.properties.tableName);
      const tableExists = await this.table.exists();
      if (!tableExists || !tableExists[0]) {
        await this.table.create(this.properties.tableName);
      }

      this.columnFamily = this.table.family(this.properties.columnFamilyName);
      const columnFamilyExists = await this.columnFamily.exists();
      if (!columnFamilyExists || !columnFamilyExists[0]) {
        await this.columnFamily.create(this.properties.columnFamilyName);
      }

      callback();
    } catch (error) {
      callback(error);
    }
  }

  taskConfigs(maxTasks, callback) {
    const taskConfig = {
      maxTasks,
      batchSize: this.properties.batchSize,
      bigTable: this.bigTable,
      table: this.table,
      columnFamily: this.columnFamily,
    };

    callback(null, taskConfig);
  }

  stop() {
    // nothing to do
  }
}

module.exports = BigTableSinkConnector;
