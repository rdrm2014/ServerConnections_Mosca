/**
 * Created by ricardomendes on 29/03/16.
 */

var src = process.cwd() + '/src/';
var config = require(src + 'config/config');

var log = require(src + 'log/log')(module);

var mosca = require('mosca');
var AuthMosca = require(process.cwd() + '/lib/AuthMosca.js');


var authSystem = new AuthMosca();

var ascoltatore = {
    //using ascoltatore
    type: 'mongo',
    url: config.get('mongoose:uri'),
    pubsubCollection: 'ascoltatori',
    mongo: {}
};

var moscaSettings = {
    port: config.get('mongoose:port'),
    backend: ascoltatore,
    persistence: {
        factory: mosca.persistence.Mongo,
        url: config.get('mongoose:uri')
    },
    http: {
        port: 3000,
        bundle: true,
        static: './'

    }
};

var server = new mosca.Server(moscaSettings);

server.on('ready', setup);

function setup() {
    server.authenticate = authSystem.authenticate();
    server.authorizeSubscribe = authSystem.authorizeSubscribe();
    server.authorizePublish = authSystem.authorizePublish();
    console.log('Mosca server is up and running')
}

server.on('clientConnected', function (client) {
    //console.log('client connected', client.id);
});

server.on('published', function (packet) {
    //console.log('Published', packet.payload);
});

