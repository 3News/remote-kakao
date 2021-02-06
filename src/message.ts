import { Socket } from 'socket.io';
import { KakaoLink, Plain } from './reply';
import { KalingType } from './reply/KakaoLink';

export type MessageType = 'KakaoLink' | 'plain';

export class Message {
  constructor(
    sender: string,
    content: string,
    room: string,
    isGroupChat: boolean,
    profileImage: string,
    packageName: string,
    socket: Socket
  ) {
    this.sender = sender;
    this.content = content;
    this.room = room;
    this.isGroupChat = isGroupChat;
    this.packageName = packageName;
    this.getProfileImage = () => profileImage;
    this.socket = socket;
  }
  public sender: string;
  public content: string;
  public room: string;
  public isGroupChat: boolean;
  public packageName: string;
  public getProfileImage: () => string;
  public socket: Socket;
  public async reply(content: string): Promise<boolean>;
  public async reply(content: {
    templateId: number;
    templateArgs: { [key: string]: string };
    kalingType: KalingType;
  }): Promise<boolean>;
  public async reply(
    content: string | { templateId: number; templateArgs: { [key: string]: string }; kalingType: KalingType }
  ) {
    return new Promise<boolean>((resolve, reject) => {
      if (this.socket === null) resolve(false);
      if (typeof content === 'string') {
        this.socket.emit('send', new Plain(this.room, content as string));
        this.socket.on('success', () => {
          resolve(true);
        });
        this.socket.on('fail', () => {
          resolve(false);
        });
      } else {
        this.socket.emit(
          'send',
          new KakaoLink(
            this.room,
            '4.0',
            (content as { templateId: number; templateArgs: { [key: string]: string }; kalingType: KalingType })
              .templateId as number,
            (content as { templateId: number; templateArgs: { [key: string]: string }; kalingType: KalingType })
              .templateArgs as { [key: string]: string },
            (content as { templateId: number; templateArgs: { [key: string]: string }; kalingType: KalingType })
              .kalingType as KalingType
          )
        );
        this.socket.on('success', () => {
          resolve(true);
        });
        this.socket.on('fail', () => {
          resolve(false);
        });
      }
    });
  }
  public async replyRoom(room: string, content: string): Promise<boolean>;
  public async replyRoom(
    room: string,
    content: { templateId: number; templateArgs: { [key: string]: string }; kalingType: KalingType }
  ): Promise<boolean>;
  public async replyRoom(
    room: string,
    content: string | { templateId: number; templateArgs: { [key: string]: string }; kalingType: KalingType }
  ) {
    return new Promise<boolean>((resolve, reject) => {
      if (this.socket === null) resolve(false);
      if (typeof content === 'string') {
        this.socket.emit('send', new Plain(room, content as string));
        this.socket.on('success', () => {
          resolve(true);
        });
        this.socket.on('fail', () => {
          resolve(false);
        });
      } else {
        this.socket.emit(
          'send',
          new KakaoLink(
            room,
            '4.0',
            (content as { templateId: number; templateArgs: { [key: string]: string }; kalingType: KalingType })
              .templateId as number,
            (content as { templateId: number; templateArgs: { [key: string]: string }; kalingType: KalingType })
              .templateArgs as { [key: string]: string },
            (content as { templateId: number; templateArgs: { [key: string]: string }; kalingType: KalingType })
              .kalingType as KalingType
          )
        );
        this.socket.on('success', () => {
          resolve(true);
        });
        this.socket.on('fail', () => {
          resolve(false);
        });
      }
    });
  }
}
