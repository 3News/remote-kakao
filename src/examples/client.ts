import { createConnection } from 'net';
import { Worker } from '../network';

const socket = createConnection({ port: 3000, host: 'localhost' });

socket.on('connect', () => {
  const net = new Worker(socket, (data) => {
    console.log('received:', data.toString());
  });

  interface args {
    sender: string;
    content: string;
    room: string;
    isGroupChat: boolean;
    profileImage: string;
    packageName: string;
  }

  setInterval(() => {
    net.send(JSON.stringify({
      event: 'chat',
      args: {
        sender: 'ee',
        content: '>ee',
        room: 'ee',
        isGroupChat: false,
        profileImage: '',
        packageName: 'com.kakao.talk'
      }
    }));
  }, 1000)
});
