using SignalR.Client;

namespace SignalRDemos.Console
{
    class Program
    {
        public static void Main(string[] args)
        {
            // Connect to the service
            var connection = new Connection("http://localhost:61001/echo");
          
            // Print the message when it comes in
            connection.Received += data => { 
                System.Console.WriteLine(data); 
            };

            // Start the connection
            connection.Start().Wait();

            string line = null;
            while ((line = System.Console.ReadLine()) != null)
            {
                // Send a message to the server
                connection.Send(line).Wait();
            }
        }
    }
}
