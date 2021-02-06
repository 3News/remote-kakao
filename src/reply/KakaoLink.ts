export type KalingType = 'default' | 'custom';

export class KakaoLink {
  constructor(
    room: string,
    version: '4.0',
    templateId: number,
    templateArgs: { [key: string]: string } = {},
    kalingType: KalingType = 'custom'
  ) {
    this.room = room;
    this.version = version;
    this.templateId = templateId;
    this.templateArgs = templateArgs;
    this.kalingType = kalingType;
  }
  public room: string;
  public version: '4.0';
  public templateId: number;
  public templateArgs: { [key: string]: string };
  public kalingType: KalingType;
  toJSON(): {
    messageType: 'KakaoLink';
    kalingType: KalingType;
    room: string;
    link_ver: '4.0';
    template_id: number;
    template_args: { [key: string]: string };
  } {
    return {
      messageType: 'KakaoLink',
      kalingType: this.kalingType,
      room: this.room,
      link_ver: this.version,
      template_id: this.templateId,
      template_args: this.templateArgs,
    };
  }
}
