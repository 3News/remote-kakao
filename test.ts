import { RKServer, Message } from './src';

const server = new RKServer();
const prefix = '>';

server.on('login', (port) => {
  console.log(`Listening on :${port}`);
});

server.on('message', async (msg: Message) => {
  if (!msg.content.startsWith(prefix)) return;

  const args = msg.content.slice(prefix.length).split(' ');
  const cmd = args.shift();

  if (cmd === 'ee') {
    await msg.reply('ee').catch((reason: string) => {
      if (reason === 'timeout') {
        console.log('timeout!!!');
      }
    });
  }
});

server.login();
