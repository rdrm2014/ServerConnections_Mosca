var request = require('unirest');

var src = process.cwd() + '/src/';
var config = require(src + 'config/config');


function AuthMosca() {
}

AuthMosca.prototype.authenticate = function () {
    return function (client, username, password, callback) {
        callback(null, request.post(config.get('authentication:uri') + ':' + config.get('authentication:port') + '/api/devices/info')
            .header('Authorization', 'Bearer ' + password)
            .end(function (response) {
                var data = response.body;
                //console.log(data);
                if ((data.name == username)) {
                    client.channels = data.channels;
                    //console.log("client.channels: " + client.channels);
                    return true;
                } else {
                    console.log('\x1b[36m', 'ERRORERRORERRORERRORERRORERRORERROR', '\x1b[0m');
                    console.log('\x1b[36m', data, '\x1b[0m');
                    return false;
                }
            }));
    }
};

AuthMosca.prototype.authorizePublish = function () {
    return function (client, topic, payload, callback) {
        if (client.channels != null) {
            if (client.channels.indexOf(topic) != -1) {
                callback(null, true);
            } else {
                console.log('\x1b[36m', client, '\x1b[0m');
                callback(null, false);
            }
        } else {
            callback(null, false);
        }
    }
};

AuthMosca.prototype.authorizeSubscribe = function () {
    return function (client, topic, callback) {
        if (client.channels != null) {
            if (client.channels.indexOf(topic) != -1) {
                callback(null, true);
            } else {
                console.log('\x1b[36mXXXXXXX', topic, '\x1b[0m');
                callback(null, false);
            }
        } else {
            callback(null, false);
        }
    }
};

module.exports = AuthMosca;
