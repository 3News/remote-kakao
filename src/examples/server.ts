import { createServer, Server } from 'net';
import { Worker } from './network';

const rooms: {} = {};
const clients: Array<any> = [];
const server: Server = createServer();

server.on('connection', (socket) => {
  console.log('new client arrived');

  const net = new Worker(socket, (data) => {
    console.log('received:', data.toString());
  });

  clients.push({ socket, net });
  net.send('Hello, world!');

  socket.on('end', () => {
    console.log('socket end');
  });
  socket.on('close', () => {
    console.log('socket close');
  });
  socket.on('error', (e) => {
    console.log(e);
  });
});

server.on('error', (e) => {
  console.log(e);
});

server.listen(8080);
