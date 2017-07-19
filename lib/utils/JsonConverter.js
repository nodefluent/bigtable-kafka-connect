

const { Converter } = require('kafka-connect');

class JsonConverter extends Converter {

  fromConnectData(data, callback) {
    callback(null, data);
  }

  toConnectData(message, callback) {
    return callback(null, message);
  }
}

module.exports = JsonConverter;
