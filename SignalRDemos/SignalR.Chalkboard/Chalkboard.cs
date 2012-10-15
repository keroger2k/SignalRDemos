using SignalR.Hubs;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SignalRDemos.SignalR.Chalkboard
{
    [HubName("chalkBoard")]
    public class ChalkboardHub : Hub, IConnected, IDisconnect
    {
        private static readonly ConcurrentDictionary<string, object> _connections =
            new ConcurrentDictionary<string, object>();

        private static int messageCount = 0;

        public void lineStarting(Coordinate coordinate)
        {
            Clients.beginLine(coordinate.positionX, coordinate.positionY, Context.ConnectionId.Substring(0, 3));
            Clients.setMessageCount(messageCount++);
        }

        public void lineDrawing(Coordinate coordinate)
        {
            Clients.continueLine(coordinate.positionX, coordinate.positionY);
            Clients.setMessageCount(messageCount++);
        }

        public Task clearCanvas()
        {
            return Clients.clear();
        }

        public Task joinAdminGroup()
        {
            return Groups.Add(Context.ConnectionId, "Admin");
        }

        public Task leaveAdminGroup()
        {
            return Groups.Remove(Context.ConnectionId, "Admin");
        }

        public Task sendMessage(string message)
        {
            return Clients["Admin"].messageAdmins(message);
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

    public class Coordinate
    {
        public double positionX { get; set; }
        public double positionY { get; set; }
    }

}