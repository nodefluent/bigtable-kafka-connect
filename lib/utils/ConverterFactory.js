

const { Converter } = require('kafka-connect');

class InjectableConverter extends Converter {

  constructor(etl) {
    super();
    this.etl = etl;
  }

  fromConnectData(data, callback) {
    callback(null, data); // no action required, as we produce objects directly
  }

  toConnectData(message, callback) {
    this.etl(message, callback);
  }
}

class ConverterFactory {

    /**
     * Pass in a function that receives the message value
     * calls a callback(null, {}) with the transformed value
     * returns an instance of a Converter that can be passed into the
     * Converter-Array param of the SinkConfig
     * @param {*} etlFunction
     * @return {}
     */
  static createSinkSchemaConverter(etlFunction) {
    if (typeof etlFunction !== 'function') {
      throw new Error('etlFunction must be a function.');
    }

    return new InjectableConverter(ConverterFactory.getSinkSchemaETL(etlFunction));
  }

  static getSinkSchemaETL(etlFunction) {
    return (message, callback) => {
      etlFunction(message.value, (error, messageValue) => {
        if (error) {
          return callback(error);
        }

        message.value = {
          key: message.key,
          value: messageValue,
          partition: message.partition,
          timestamp: new Date().toISOString(),
          topic: message.topic,
        };

        return callback(null, message);
      });
    };
  }
}

module.exports = ConverterFactory;
