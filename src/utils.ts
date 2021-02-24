import { createServer, Server, Socket } from 'net';
import { RKClient } from './client';
import { Message } from './message';
import { Network } from './network';

export class RKUtils {
  constructor(msg: Message) {
    this.socket = msg.socket;
    this.client = msg.client;
    this.profileImage = msg.getProfileImage();
  }
  private socket: Network;
  private client: RKClient;
  private profileImage: string;
  async eval(x: string): Promise<string> {
    return new Promise((resolve, _) => {
      this.socket.send(
        JSON.stringify({
          event: 'eval',
          args: x,
        })
      );
      this.client.on('eval', (arg: string) => {
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
