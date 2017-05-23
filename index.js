var tmi = require("tmi.js");
var midiConnector = require('midi-launchpad').connect(0, 1);
var creds = require('./creds');

var validmsg = /^!light ([1-8]) ([A-H])$/

var options = {
    options: {
        debug: true,
        clientId: creds.twitch.clientId
    },
    connection: {
        reconnect: true
    },
    identity: {
        username: creds.twitch.username,
        password: creds.twitch.password
    },
    channels: creds.twitch.channels
};

midiConnector.on('ready', function(launchpad) {
    var client = new tmi.client(options);

    client.on('connected', (address, port) => {
      client.on('message', (channel, userstate, message) => {
        if ( ( result = validmsg.exec(message) ) != null ){
            var x = result[1] - 1;
            var y = result[2].charCodeAt(0) - 65;
            console.log(x,y);

            launchpad.getButton(x,y).light(launchpad.colors.red.high);
        }
      });
    });

    client.connect();
});


