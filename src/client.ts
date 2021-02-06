import express from 'express';
import socketio from 'socket.io';
import { createServer } from 'http';
import { EventEmitter } from 'events';
import { Message } from './message';

const app = express();
const server = createServer(app);
const io = socketio(server);
const port = process.env.PORT || 3000;

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
  private s: SocketIO.Socket | undefined;

  public login(useKakaoLink: true, email: string, password: string): void;
  public login(useKakaoLink?: false): void;
  public login(useKakaoLink?: boolean, email?: string, password?: string): void {
    if (!!useKakaoLink) {
      this.email = String(email);
      this.password = String(password);
    }

    // app.get('/send/:msg', (req, res) => {
    //  if (this.s === undefined) return res.send({ message: 'no session!', success: false });
    //  this.s.emit('send', { messageType: 'plain', room: '카카오톡 봇 커뮤니티', message: req.params.msg });
    //  res.send({ message: 'success!', success: true });
    // });

    const self = this;

    io.on('connection', (socket: SocketIO.Socket) => {
      console.log(`${socket.id} connected!`);
      socket.on(
        'chat',
        (args: {
          sender: string;
          content: string;
          room: string;
          isGroupChat: boolean;
          profileImage: string;
          packageName: string;
        }) => {
          self.s = socket;
          self.emit(
            'message',
            new Message(
              args.sender,
              args.content,
              args.room,
              args.isGroupChat,
              args.profileImage,
              args.packageName,
              self.s
            )
          );
        }
      );
      socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected!`)
      })
    });

    server.listen(port, () => {
      this.emit('login', port);
    });
  }
}
