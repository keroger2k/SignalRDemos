using SignalR.Hubs;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace SignalRDemos.SignalR.Chalkboard
{
    [HubName("chalkBoard")]
    public class ChalkboardHub : Hub, IConnected, IDisconnect
    {
        private static readonly ConcurrentDictionary<string, object> _connections =
            new ConcurrentDictionary<string, object>();

        private static int messageCount = 0;

        public void lineStarting(double x, double y, string color)
        {
            Clients.beginLine(x, y, color, messageCount++);
        }

        public void lineDrawing(double x, double y)
        {
            Clients.continueLine(x, y, messageCount++);
        }

        public void clearCanvas()
        {
            Clients.clear();
        }

        public Task Connect()
        {
            _connections.TryAdd(Context.ConnectionId, null);
            return Clients.clientCountChanged(_connections.Count);
        }

        public Task Reconnect(IEnumerable<string> groups)
        {
            _connections.TryAdd(Context.ConnectionId, null);
            return Clients.clientCountChanged(_connections.Count);
        }

        public Task Disconnect()
        {
            object value;
            _connections.TryRemove(Context.ConnectionId, out value);
            return Clients.clientCountChanged(_connections.Count);
        }
    }

}