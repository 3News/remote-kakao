import { createServer, Server, Socket } from 'net';
import { RKServer } from './client';
import { Message } from './message';
import { Worker } from './network';

export class RKUtils {
  constructor(msg: Message) {
    this.socket = msg.socket;
    this.server = msg.server;
    this.profileImage = msg.getProfileImage();
  }
  private socket: Worker;
  private server: RKServer;
  private profileImage: string;
  async eval(x: string): Promise<string> {
    return new Promise((resolve, _) => {
      this.socket.send(
        JSON.stringify({
          event: 'eval',
          args: x,
        })
      );
      this.server.on('evaled', (arg: string) => {
        resolve(arg)
      })
    });
  }
  hashCode(str: string) {
    let hash = 0,
      chr;
    for (let i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0;
    }
    return hash;
  }
  getProfileHash() {
    return this.hashCode(this.profileImage);
  }
  clipboard() {}
}
