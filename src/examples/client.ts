import { createConnection } from 'net';
import { Worker } from './network';

const socket = createConnection({ port: 8080, host: 'localhost' });

socket.on('connect', () => {
  const net = new Worker(socket, (data) => {
    console.log('received:', data.toString());
  });

  net.send('Hi!');
});
