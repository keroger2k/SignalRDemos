/// <reference path="../scripts/jquery-1.8.2.js" />
/// <reference path="../scripts/jquery.signalR-0.5.3.js" />
/// <reference path="../Scripts/jquery.mobile-1.2.0.js" />
/// <reference path="../Scripts/jquery-ui-1.9.0.js" />

$(function () {
    
    var hub = $.connection.chalkBoard,
        $clientCount = $("#clientCount"),
        $messages = $('#messages'),
        $transport = $('#transport'),
        count = 0,
        canvas = document.getElementById('chalkboard'),
        context = canvas.getContext('2d');

    $.extend(hub, {
        beginLine: function (startX, startY, color, messageCount) {
            var lineWidth = 12;
            context.strokeStyle = color || '#FFF';
            context.lineWidth = lineWidth;
            context.lineCap = 'round';
            context.beginPath();
            context.moveTo(startX, startY);
            $messages.text(messageCount);
        },
        continueLine: function (mouseX, mouseY, messageCount) {
            context.lineTo(mouseX + 1, mouseY + 1);
            context.stroke();
            $messages.text(messageCount);
        },
        clear: function() {
            context.clearRect(0, 0, canvas.width, canvas.height);
        },
        clientCountChanged: function (count) {
            $clientCount.text(count);
        }
    });

    var $chalkBoard = $('#chalkboard'),
                 $clear = $('#clear'),
                 startX = 0,
                 startY = 0,
                 mouseX = 0,
                 mouseY = 0,
                 offset = 0,
                 isMouseDown = false;

    $chalkBoard.bind('mousedown vmousedown', function (e) {
        isMouseDown = true;
        if (isMouseDown) {
            offset = $chalkBoard.offset();
            startX = e.pageX - offset.left;
            startY = e.pageY - offset.top;
            hub.lineStarting(startX, startY, "#" + $.connection.hub.id.substr(0, 3));
        }
    });

    $chalkBoard.mousemove(function (e) {
        if (isMouseDown) {
            mouseX = e.pageX - offset.left;
            mouseY = e.pageY - offset.top;
            hub.lineDrawing(mouseX, mouseY);
        }
    });

    $chalkBoard.mouseup(function (e) {
        isMouseDown = false;
    });

    $clear.click(function () {
        hub.clearCanvas();
    });

    $.connection.hub.start().done(function () {
        $transport.text($.connection.hub.transport.name);
    });
});