/// <reference path="../scripts/jquery-1.8.2.js" />
/// <reference path="../scripts/jquery.signalR-0.5.3.js" />
/// <reference path="../Scripts/jquery.mobile-1.2.0.js" />
/// <reference path="../Scripts/jquery-ui-1.9.0.js" />

$(function () {
    
    var hub = $.connection.chalkBoard,
        $clientCount = $("#clientCount"),
        $messages = $('#messages'),
        $transport = $('#transport'),
        $leaveAdmin = $('#leaveAdmin'),
        $addAdmin = $('#addAdmin'),
        $adminMessage = $('#adminMessage'),
        $adminMessageText = $('#adminMessageText'),
        $sendMessageButton = $('#sendAdminMessage'),
        count = 0,
        canvas = document.getElementById('chalkboard'),
        context = canvas.getContext('2d');

    $.extend(hub, {
        beginLine: function (startX, startY, color) {
            context.strokeStyle = color;
            context.lineWidth = 12;
            context.lineCap = 'round';
            context.beginPath();
            context.moveTo(startX, startY);
        },
        continueLine: function (mouseX, mouseY, messageCount) {
            context.lineTo(mouseX + 1, mouseY + 1);
            context.stroke();
        },
        clear: function() {
            context.clearRect(0, 0, canvas.width, canvas.height);
        },
        setMessageCount: function (messageCount) {
            $messages.text(messageCount);
        },
        clientCountChanged: function (count) {
            $clientCount.text(count);
        },
        messageAdmins: function (message) {
            $adminMessage.text(message);
            $('.alert').show();
            $adminMessageText.val('');
        },
    });

    var $chalkBoard =
        $('#chalkboard'),
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
            hub.lineStarting({
                positionX: startX,
                positionY: startY
            });
        }
    });

    $chalkBoard.bind('mousemove vmousemove', function (e) {
        if (isMouseDown) {
            mouseX = e.pageX - offset.left;
            mouseY = e.pageY - offset.top;
            hub.lineDrawing({ 
                positionX: mouseX, 
                positionY: mouseY
            });
        }
    });

    $chalkBoard.mouseup(function (e) {
        isMouseDown = false;
    });

    $clear.click(function () {
        hub.clearCanvas();
    });

    $addAdmin.click(function () {
        hub.joinAdminGroup();
    });

    $leaveAdmin.click(function () {
        hub.leaveAdminGroup();
    });

    $sendMessageButton.click(function () {
        var message = $adminMessageText.val();
        hub.sendMessage(message);
    });

    $.connection.hub.start().done(function () {
        $transport.text($.connection.hub.transport.name);
    });
});