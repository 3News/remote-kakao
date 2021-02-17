import { Socket } from 'socket.io';
import { Message } from './message';

export class RKUtils {
  constructor(msg: Message) {
    this.socket = msg.socket;
    this.profileImage = msg.getProfileImage();
  }
  socket: Socket;
  profileImage: string;
  async eval(x: string): Promise<string> {
    return new Promise((resolve, _) => {
      this.socket.emit('eval', x);
      this.socket.on('evaled', (arg: string) => {
        resolve(arg);
      });
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
