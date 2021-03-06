"use strict";

var GameClient = function (u, g) {

    this.confirm = function (owner_id, opponent_id, game_id, type_of_game) {
        if (connection) {
            var msg = {
                type: 'confirm',
                owner_id: owner_id,
                opponent_id: opponent_id,
                game_id: game_id,
                type_of_game: type_of_game
            };

            console.log('confirm ' + game_id + ' with ' + owner_id + ' against ' + opponent_id);
            connection.send(JSON.stringify(msg));
        }
    };

    this.join = function (user_id, game_id) {
        if (connection) {
            var msg = {
                type: 'join',
                opponent_id: user_id,
                game_id: game_id
            };

            console.log('join ' + game_id);
            connection.send(JSON.stringify(msg));
        }
    };

    this.start = function () {

        window.onbeforeunload = function () {
            if (connection.readyState === 1) {
                connection.close();
            }
        };

        $(document).ready(function () {
            window.WebSocket = window.WebSocket || window.MozWebSocket;
            if (!window.WebSocket) {
                return;
            }

            connection = new WebSocket('ws://' + WebSocketURL + ':' + WebSocketPort);

            connection.onopen = function () {
                console.log('open');
            };

            connection.onerror = function (error) {
                console.log('error');
            };

            connection.onmessage = function (message) {
                var msg = JSON.parse(message.data);

                if (msg.type === 'join') {
                    console.log('join ACK: ' + msg.game_id + ' by ' + msg.opponent_name + ' against ' + msg.owner_name);
                    if (msg.opponent_name === uid) {
                        $('a#button_game_' + msg.game_id).html('<i class="glyphicon glyphicon-pause"></i> confirm...');
                    } else {
                        $('a#button_game_' + msg.game_id).html('<i class="glyphicon glyphicon-exclamation-sign"></i> confirm');
                        $('a#button_game_' + msg.game_id).attr('href', 'javascript:client.confirm("' + msg.owner_id + '","' + msg.opponent_id + '","' + msg.game_id + '")');
                        $('div#opponent_' + msg.game_id).html('<b>' + msg.opponent_name + '</b>');
                    }
                } else if (msg.type === 'confirm') {
                    console.log('confirm ACK: ' + msg.game_id + ' with ' + msg.owner_id + ' against ' + msg.opponent_id + ' with ' + msg.color);
                    if (msg.type_of_game !== 'offline') {
                        if (msg.owner_id === uid) {
                            window.location.href = '/games/play/' + game + '/?game_id=' + msg.game_id + '&owner_id=' + msg.owner_id + '&opponent_id=' + msg.opponent_id + '&color=' + msg.color + '&mode=' + msg.mode;
                        } else {
                            window.location.href = '/games/play/' + game + '/?game_id=' + msg.game_id + '&owner_id=' + msg.opponent_id + '&opponent_id=' + msg.owner_id + '&color=' + (msg.color === 'black' ? 'white' : 'black') + '&mode=' + msg.mode;
                        }
                    } else {
                        window.location.href = '/mygames/';
                    }
                }
            };

            var loop = setInterval(function () {
                if (connection.readyState !== 1) {
                    console.log('error connection');
                } else {
                    console.log('connecting ' + uid + ' ...');

                    var msg = {
                        type: 'connect',
                        user_id: uid
                    };

                    connection.send(JSON.stringify(msg));
                    clearInterval(loop);
                }
            }, 1000);
        });
    };

    var init = function (u, g) {
        uid = u;
        game = g;
    };

    var connection;
    var uid;
    var game;

    init(u, g);
};