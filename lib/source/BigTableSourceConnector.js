const { SourceConnector } = require('kafka-connect');
const BigTable = require('@google-cloud/bigtable');

class BigTableSourceConnector extends SourceConnector {

  /**
   * @param  {Object}   properties
   * @param  {Number}   properties.projectId
   * @param  {String}   properties.instanceName
   * @param  {String}   properties.tableName
   * @param  {String}   [properties.columnFamilyName]
   * @param  {Function} callback
   */
  async start(properties, callback) {
    // TODO: support authentication options

    this.properties = properties;

    try {
      this.bigTable = new BigTable({ projectId: this.properties.projectId });
      this.instance = this.bigTable.instance(this.properties.instanceName);
      const instanceExists = await this.instance.exists();
      if (!instanceExists || !instanceExists[0]) {
        return callback(new Error(`Instance does not exists ${this.properties.instanceName}`));
      }

      this.table = this.instance.table(this.properties.tableName);
      const tableExists = await this.table.exists();
      if (!tableExists || !tableExists[0]) {
        return callback(new Error(`Table does not exists ${this.properties.tableName}`));
      }

      if (this.columnFamily) {
        this.columnFamily = this.table.family(this.properties.columnFamilyName);
        const columnFamilyExists = await this.columnFamily.exists();
        if (!columnFamilyExists || !columnFamilyExists[0]) {
          return callback(new Error(`Column Family does not exists ${this.properties.columnFamilyName}`));
        }
      }

      return callback();
    } catch (error) {
      return callback(error);
    }
  }

  taskConfigs(maxTasks, callback) {
    const taskConfig = {
      maxTasks,
      maxPollCount: this.properties.maxPollCount,
      bigTable: this.bigTable,
      table: this.table,
      columnFamily: this.columnFamily,
    };

    callback(null, taskConfig);
  }

  stop() {
    // bigTable closes itself after .run() finishes
  }
}

module.exports = BigTableSourceConnector;
