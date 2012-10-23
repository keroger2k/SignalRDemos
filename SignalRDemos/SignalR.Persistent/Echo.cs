using SignalR;
using SignalR.Hubs;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SignalRDemos.SignalR.MoveShape
{
    public class Echo : PersistentConnection
    {
        protected override Task OnReceivedAsync(IRequest request, string connectionId, string data)
        {
            // Broadcast data to all clients
            return Connection.Broadcast(data);
        }

        protected override Task OnConnectedAsync(IRequest request, string connectionId)
        {
            return base.OnConnectedAsync(request, connectionId);
        }

        protected override Task OnDisconnectAsync(string connectionId)
        {
            return base.OnDisconnectAsync(connectionId);
        }

        protected override Task OnReconnectedAsync(IRequest request, IEnumerable<string> groups, string connectionId)
        {
            return base.OnReconnectedAsync(request, groups, connectionId);
        }
    }
}