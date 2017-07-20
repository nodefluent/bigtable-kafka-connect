

const { Converter } = require('kafka-connect');

class JsonConverter extends Converter {
  fromConnectData(data, callback) {
    callback(null, JSON.stringify(data));
  }

  toConnectData(message, callback) {
    try {
      message.value = JSON.parse(message.value);
    } catch (error) {
      return callback(error);
    }

    return callback(null, message);
  }
}

module.exports = JsonConverter;
