import { RKClient } from './src';

const client = new RKClient();

client.on('message', (msg) => {
  console.log(msg.content)
})

client.login();
