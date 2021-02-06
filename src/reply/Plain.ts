export class Plain {
  constructor(room: string, message: string) {
    this.room = room;
    this.message = message;
  }
  public room: string;
  public message: string;
  toJSON(): { messageType: 'plain'; room: string; message: string } {
    return { messageType: 'plain', room: this.room, message: this.message };
  }
}
