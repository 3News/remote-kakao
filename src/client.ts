import { Socket } from 'net';
import { EventEmitter } from 'events';
import { Message } from './message';
import { Network } from './network';
import { v4 } from 'uuid';

const port = process.env.PORT || 3000;
const client: Socket = new Socket();


const wa = new Network('wasans', '172.30.1.14', 5000, (data) => {
  if (data.msg.includes('rash')) {
    // wa.send(JSON.stringify({
    //   state: 'message',
    //   args: {
    //     type: 'plain',
    //     msg: {
    //       content: 'ee',
    //       room: '카카오톡 봇 커뮤니티'
    //     }
    //   }
    // }))
    console.log('wa')
  }
});

export type RKEvent = 'login' | 'message';

export declare interface RKClient {
  on(event: 'message', listener: (message: Message) => void): this;
  on(event: 'login', listener: (port: number | string) => void): this;
  on(event: 'sent', listener: (port: number | string) => void): this;
  once(event: 'message', listener: (message: Message) => void): this;
  once(event: 'login', listener: (port: number | string) => void): this;
  once(event: 'sent', listener: (port: number | string) => void): this;
}

export class RKClient extends EventEmitter {
  private email: string = '';
  private password: string = '';
  private jsKey: string = '';

  public login(useKakaoLink: true, email: string, password: string): void;
  public login(useKakaoLink?: false): void;
  public login(useKakaoLink?: boolean, email?: string, password?: string): void {
    if (!!useKakaoLink) {
      this.email = String(email);
      this.password = String(password);
    }

    const self = this;

    client.setKeepAlive(true);

    // client.connect(
    //   {
    //     host: '172.30.1.15',
    //     port: 9500,
    //   },
    //   () => {
    //     client.write(
    //       JSON.stringify({
    //         name: 'debugRoom',
    //         data: {
    //           botName: 'RKCompanion',
    //           authorName: 'remote-kakao',
    //           roomName: 'remote-kakao',
    //           isGroupChat: false,
    //           packageName: 'com.kakao.talk',
    //           message: {
    //             content: 'wasans'
    //           },
    //         },
    //       })
    //     );
    //     client.end()

    //     client.on('data', (c) => {
    //       console.log(c.toString())
    //     })

    //     client.on('data', () => {
    //       console.log('연결 끗 ㅋㅋ')
    //     })
    //   }
    // );
  }
}

// export class RKServer extends EventEmitter {
//   private email: string = '';
//   private password: string = '';
//   private jsKey: string = '';

//   public login(useKakaoLink: true, email: string, password: string): void;
//   public login(useKakaoLink?: false): void;
//   public login(
//     useKakaoLink?: boolean,
//     email?: string,
//     password?: string
//   ): void {
//     if (!!useKakaoLink) {
//       this.email = String(email);
//       this.password = String(password);
//     }

//     const self = this;

//     server.on('connection', (socket) => {
//       const uuid = v4();
//       console.log(`${uuid} connected!`);

//       const net = new Worker(socket, (data) => {
//         const { event, args } = JSON.parse(data.toString());

//         switch (event) {
//           case 'chat':
//             self.emit(
//               'message',
//               new Message(
//                 args.sender,
//                 args.content,
//                 args.room,
//                 args.isGroupChat,
//                 args.profileImage,
//                 args.packageName,
//                 net,
//                 self
//               )
//             );
//             break;
//           case 'sent':
//             this.emit('sent', args === 'true');
//             break;
//           case 'evaled':
//             this.emit('evaled', args.toString());
//             break;
//         }
//       });

//       clients.push({ socket, net, uuid });
//       net.send('Hello, world!');

//       socket.on('end', () => {
//         console.log('socket end');
//       });
//       socket.on('close', () => {
//         console.log('socket close');
//       });
//       socket.on('error', (e) => {
//         console.log(e);
//       });
//     });

//     server.on('error', (e) => {
//       console.log(e);
//     });

//     server.listen(port, () => {
//       this.emit('login', port);
//     });
//   }
// }
