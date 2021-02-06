import { Socket } from 'socket.io';

export const RKEval = async (socket: Socket, x: string): Promise<string> => {
  return new Promise((resolve, _) => {
    socket.emit('eval', x);
    socket.on('evaled', (arg: string) => {
      resolve(arg);
    });
  });
};
