import { Socket } from 'net';

export class Network {
  private client: Socket;

  constructor(
    password: string,
    ip: string,
    port: number,
    client: Socket,
    handler: (data: any) => void
  ) {
    this.client = client;

    this.client.connect(
      {
        host: ip,
        port,
      },
      () => {
        this.send(
          JSON.stringify({
            state: 'login',
            args: { password },
          })
        );

        this.send(
          JSON.stringify({
            state: 'message',
            args: {
              
            }
          })
        )

        this.client.on('data', (c) => {
          handler(JSON.parse(c.toString()));
        });

        this.client.on('close', () => {
          console.log('connection closed');
        });
      }
    );
  }

  public send = (text: string) => this.client.write(`${text}\n`);
}
