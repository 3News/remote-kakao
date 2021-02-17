import { createServer, Server, Socket } from 'net';
import { EventEmitter } from 'events';
import { Message } from './message';
import { Worker } from './network';
import { v4 } from 'uuid';

const port = process.env.PORT || 3000;
const clients: Array<{
  socket: Socket;
  net: Worker;
  uuid: string;
}> = [];
const server: Server = createServer();

export type RKEvent = 'login' | 'message';

export declare interface RKClient {
  on(event: 'message', listener: (message: Message) => void): this;
  on(event: 'login', listener: (port: number | string) => void): this;
  once(event: 'message', listener: (message: Message) => void): this;
  once(event: 'login', listener: (port: number | string) => void): this;
}

export class RKServer extends EventEmitter {
  private email: string = '';
  private password: string = '';
  private jsKey: string = '';

  public login(useKakaoLink: true, email: string, password: string): void;
  public login(useKakaoLink?: false): void;
  public login(
    useKakaoLink?: boolean,
    email?: string,
    password?: string
  ): void {
    if (useKakaoLink) {
      this.email = String(email);
      this.password = String(password);
    }

    const self = this;

    server.on('connection', (socket) => {
      const uuid = v4();
      console.log(`${uuid} connected!`);

      const net = new Worker(socket, (data) => {
        const { event, args } = JSON.parse(data.toString());

        switch (event) {
          case 'chat':
            self.emit(
              'message',
              new Message(
                args.sender,
                args.content,
                args.room,
                args.isGroupChat,
                args.profileImage,
                args.packageName,
                net,
                self
              )
            );
            break;
          case 'sent':
            this.emit('sent', args === 'true');
            break;
          case 'evaled':
            this.emit('evaled', args.toString());
            break;
        }
      });

      clients.push({ socket, net, uuid });
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

    server.listen(port, () => {
      this.emit('login', port);
    });
  }
}
