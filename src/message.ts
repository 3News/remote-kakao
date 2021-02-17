import { createServer, Server, Socket } from 'net';
import { RKServer } from './client';
import { Worker } from './network';
import { KakaoLink, Plain } from './reply';
import { KalingType } from './reply/KakaoLink';

let queue: any = null;
let ignored: number = 0;

export type MessageType = 'KakaoLink' | 'plain';

export class Message {
  constructor(
    sender: string,
    content: string,
    room: string,
    isGroupChat: boolean,
    profileImage: string,
    packageName: string,
    socket: Worker,
    server: RKServer
  ) {
    this.sender = sender;
    this.content = content;
    this.room = room;
    this.isGroupChat = isGroupChat;
    this.packageName = packageName;
    this.getProfileImage = () => profileImage;
    this.socket = socket;
    this.server = server;
  }
  public sender: string;
  public content: string;
  public room: string;
  public isGroupChat: boolean;
  public packageName: string;
  public getProfileImage: () => string;
  public socket: Worker;
  public server: RKServer;
  public async reply(content: string): Promise<boolean>;
  public async reply(content: {
    templateId: number;
    templateArgs: { [key: string]: string };
    kalingType: KalingType;
  }): Promise<boolean>;
  public async reply(
    content:
      | string
      | {
          templateId: number;
          templateArgs: { [key: string]: string };
          kalingType: KalingType;
        }
  ) {
    return this.replyRoom(this.room, this.content);
  }
  public async replyRoom(room: string, content: string): Promise<boolean>;
  public async replyRoom(
    room: string,
    content: {
      templateId: number;
      templateArgs: { [key: string]: string };
      kalingType: KalingType;
    }
  ): Promise<boolean>;
  public async replyRoom(
    room: string,
    content:
      | string
      | {
          templateId: number;
          templateArgs: { [key: string]: string };
          kalingType: KalingType;
        }
  ) {
    return new Promise<boolean>((resolve, reject) => {
      if (this.socket === null) resolve(false);
      if (typeof content === 'string') {
        this.socket.send(
          JSON.stringify({
            event: 'send',
            args: new Plain(room, content as string),
          })
        );

        if (!queue) {
          ++ignored;
          resolve(false);
        } else {
          const sentEvent = (res: boolean) => {
            this.server.off('sent', sentEvent);
            console.log(`Ignored ${ignored} messages!`);
            ignored = 0;
            resolve(res);
          };
          this.server.on('sent', sentEvent);
          queue = true;

          setTimeout(() => reject('timeout'), 10000);
        }
      } else {
        this.socket.send(
          JSON.stringify({
            event: 'send',
            args: new KakaoLink(
              room,
              '4.0',
              (content as {
                templateId: number;
                templateArgs: { [key: string]: string };
                kalingType: KalingType;
              }).templateId as number,
              (content as {
                templateId: number;
                templateArgs: { [key: string]: string };
                kalingType: KalingType;
              }).templateArgs as { [key: string]: string },
              (content as {
                templateId: number;
                templateArgs: { [key: string]: string };
                kalingType: KalingType;
              }).kalingType as KalingType
            ),
          })
        );

        if (!queue) {
          ++ignored;
          resolve(false);
        } else {
          const sentEvent = (res: boolean) => {
            this.server.off('sent', sentEvent);
            console.log(`Ignored ${ignored} messages!`);
            ignored = 0;
            resolve(res);
          };
          this.server.on('sent', sentEvent);
          queue = true;

          setTimeout(() => reject('timeout'), 10000);
        }
      }
    });
  }
}
