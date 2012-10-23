/// <reference path="../scripts/jquery-1.8.2.js" />
/// <reference path="../scripts/jquery.signalR-0.5.3.js" />
/// <reference path="../Scripts/jquery-ui-1.9.0.js" />

$(function () {
    var connection = $.connection('/echo');

    connection.received(function (data) {
        $('#messages').append('<li>' + data + '</li>');
    });

    connection.start();

    $("#broadcast").click(function () {
        connection.send($('#msg').val());
    });
});