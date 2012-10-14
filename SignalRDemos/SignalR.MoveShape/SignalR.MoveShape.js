/// <reference path="../scripts/jquery-1.8.2.js" />
/// <reference path="../scripts/jquery.signalR-0.5.3.js" />
/// <reference path="../Scripts/jquery-ui-1.9.0.js" />

$(function () {
    var hub = $.connection.moveShape,
        $shape = $("#shape"),
        $clientCount = $("#clientCount"),
        body = window.document.body;

    $.extend(hub, {
        shapeMoved: function (cid, x, y) {
            if ($.connection.hub.id !== cid) {
                $shape.css({
                    left: (body.clientWidth - $shape.width()) * x,
                    top: (body.clientHeight - $shape.height()) * y
                });
            }
        },
        clientCountChanged: function (count) {
            $clientCount.text(count);
        }
    });

    $.connection.hub.start().done(function () {
        $shape.draggable({
            containment: "parent",
            drag: function () {
                var $this = $(this),
                    x = this.offsetLeft / (body.clientWidth - $this.width()),
                    y = this.offsetTop / (body.clientHeight - $this.height());
                hub.moveShape(x, y);
            }
        });
    });
});