import { Socket } from 'net';
import { Buffer } from 'buffer';

const buffer = Buffer.allocUnsafe(4);

export class Worker {
  constructor(socket: Socket, handler: (...args: Array<any>) => void) {
    this.socket = socket;
    this.packet = {};

    this.process = false;
    this.state = 'HEADER';
    this.payloadLength = 0;
    this.bufferedBytes = 0;
    this.queue = [];

    this.handler = handler;

    this.socket.on('data', (data: Array<any>) => {
      this.bufferedBytes += data.length;
      this.queue.push(data);
      this.process = true;
      this.onData();
    });

    this.socket.on('served', this.handler);
  }

  private enough(size: number): boolean {
    if (this.bufferedBytes >= size) return true;

    this.process = false;
    return false;
  }

  private readBytes(size: number): Buffer {
    let res: any;
    this.bufferedBytes -= size;

    if (size === this.queue[0].length) return this.queue.shift();

    if (size < this.queue[0].length) {
      res = this.queue[0].slice(0, size);
      this.queue[0] = this.queue[0].slice(size);
      return res;
    }

    res = Buffer.allocUnsafe(size);
    let offset: number = 0;
    let length: number;

    while (size > 0) {
      length = this.queue[0].length;

      if (size >= length) {
        this.queue[0].copy(res, offset);
        offset += length;
        this.queue.shift();
      } else {
        this.queue[0].copy(res, offset, 0, size);
        this.queue[0] = this.queue[0].slice(size);
      }

      size -= length;
    }

    return res
  }

  private getHeader(): void {
    if (this.enough(2)) {
      this.payloadLength = this.readBytes(2).readUInt16BE(0);
      this.state = 'PAYLOAD';
    }
  }

  private getPayload(): void {
    if (this.enough(this.payloadLength)) {
      let received: Buffer = this.readBytes(this.payloadLength);

      this.socket.emit('served', received);
      this.state = 'HEADER';
    }
  }

  private onData(): void {
    while (this.process) {
      if (this.state === 'HEADER') {
        this.getHeader();
      } else if (this.state === 'PAYLOAD') {
        this.getPayload();
      }
    }
  }

  private header(msgLength: number): void {
    this.packet.headerLength = msgLength
  }

  public send(msg: string): void {
    const buf = Buffer.from(msg);

    this.header(buf.length);
    this.packet.msg = buf;

    let contentLength = Buffer.allocUnsafe(2);

    contentLength.writeUInt16BE(this.packet.headerLength!);

    this.socket.write(contentLength);
    this.socket.write(this.packet.msg);
    this.packet = {};
  }

  socket: Socket;
  packet: {
    headerLength?: number;
    msg?: Buffer;
  } = {};
  process: boolean;
  state: string;
  payloadLength: number;
  bufferedBytes: number;
  queue: Array<any> = [];
  handler: (...args: Array<any>) => void;
}
