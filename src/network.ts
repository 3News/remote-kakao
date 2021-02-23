import { Socket } from 'net';

interface HandlerArgs {
  room: string;
  msg: string;
  sender: string;
  isGroupChat: boolean;
  packageName: string;
  send: (text: string) => boolean;
}

export class Network {
  private client: Socket;

  constructor(password: string, ip: string, port: number, handler: (data: HandlerArgs) => void) {
    this.client = new Socket();

    this.client.connect(
      {
        host: ip,
        port,
      },
      () => {
        console.log('wa')
        this.send(
          JSON.stringify({
            state: 'login',
            args: { password },
          })
        );

        setInterval(() => {
          this.send(
            JSON.stringify({
              state: 'message',
              args: {
                type: 'plain',
                msg: {
                  content: 'ee',
                  room: '카카오톡 봇 커뮤니티',
                },
              },
            })
          );
        }, 1000)

        this.client.on('data', (c) => {
          console.log(c.toString())
          const data: HandlerArgs = {
            msg: 'test',
            send: (text: string) => this.send(text),
          } as HandlerArgs;

          handler(data);
        });

        this.client.on('close', () => {
          console.log('연결 끗 ㅋㅋ');
        });
      }
    );
  }

  public send = (text: string) => this.client.write(`${text}\n`);
}
