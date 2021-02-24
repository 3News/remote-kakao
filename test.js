const password = 'wasans';

let server;
let send;
let authed = false;

importPackage(java.net, java.io, java.lang);

const handler = (data) => {
  switch (data.state) {
    case 'login':
      if (data.args.password === password) authed = true;
      Log.d('logged in: ' + authed);
      send(
        JSON.stringify({
          event: 'login',
          args: {},
        })
      );
      break;
    case 'message':
      Log.d(authed);
      Api.replyRoom('카카오톡 봇 커뮤니티', 'test', true);
      if (!authed) return;
      if (Api.canReply(data.args.msg.room)) {
        switch (data.args.type) {
          case 'plain':
            send(
              JSON.stringify({
                event: 'send',
                args: {
                  success: Api.replyRoom(
                    data.args.msg.room,
                    data.args.msg.content,
                    true
                  ),
                },
              })
            );
            break;
          case 'kakaolink':
            send(
              JSON.stringify({
                event: 'send',
                args: {
                  success: false,
                },
              })
            );
            break;
        }
      }
      break;
  }
};

const thread = new Thread({
  run: () => {
    try {
      server = new ServerSocket(5000);

      try {
        while (1) {
          socket = server.accept();

          try {
            const br = new BufferedReader(
              new InputStreamReader(socket.getInputStream())
            );
            const pw = new PrintWriter(socket.getOutputStream(), true);

            const str = br.readLine();

            line = '';
            while ((line = br.readLine()) != null) {
              if (line == '') break;

              const data = JSON.parse(line);

              Log.d('state: ' + data.state);
              handler(data);
            }

            send = (text) => pw.println(text);
          } catch (e) {
            socket.close();
            Log.e(e);
          }
        }
      } catch (e) {
        Log.e(e);

        server.close();
      }
    } catch (e) {
      Log.e(e);
    }
  },
});

thread.start();

const onStartCompile = () => server.close();
const response = (room, msg, sender, isGroupChat, _, imageDB, packageName) => {
  if (send === undefined) return;

  send(
    JSON.stringify({
      event: 'message',
      args: {
        room: room,
        content: msg,
        sender: sender,
        isGroupChat: isGroupChat,
        profileImage: imageDB.getProfileBase64(),
        packageName: packageName,
      },
    })
  );
};
