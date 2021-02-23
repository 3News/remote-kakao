import { Socket } from 'net';

let client = new Socket();

client.connect(
  {
    host: '172.30.1.14',
    port: 5000,
  },
  () => {
    client.on('data', (buffer) => {
      console.log(buffer.toString().trim());
    });

    client.on('close', () => {
      console.log('연결 끗 ㅋㅋ');
    });
  }
);
