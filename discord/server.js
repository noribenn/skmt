const http = require('http');
const querystring = require('querystring');
const discord = require('discord.js');
const client = new discord.Client();

// HTTPサーバー：起動維持用（Renderに対応）
const PORT = process.env.PORT || 3000;
http.createServer(function (req, res) {
  if (req.method === 'POST') {
    let data = "";
    req.on('data', function (chunk) {
      data += chunk;
    });
    req.on('end', function () {
      if (!data) {
        res.end("No post data");
        return;
      }
      const dataObject = querystring.parse(data);
      console.log("post:" + dataObject.type);
      if (dataObject.type === "wake") {
        console.log("Woke up in post");
        res.end();
        return;
      }
      res.end();
    });
  } else if (req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Discord Bot is active now\n');
  }
}).listen(PORT, () => {
  console.log(HTTPサーバー起動: ポート ${PORT} で待機中);
});

// BOT起動時
client.on('ready', () => {
  console.log('Bot準備完了～');
  client.user.setPresence({ activity: { name: 'クッキークリッカー' } });
});

// メッセージ受信時
client.on('message', message => {
  if (message.author.id === client.user.id || message.author.bot) {
    return;
  }
  if (message.mentions.has(client.user)) {
    const replies = [
      "なんでご飯呼んでくれなかったの？",
      "なんでマック行くとき声かけてくれなかったの？",
      "なんでラーメンてつ行くとき声かけてくれなかったの？",
      "なんで山岡家行くとき声かけてくれなかったの？",
      "なんで風俗行くとき声かけてくれなかったの？",
      "なんでコンビニ行くとき声かけてくれなかったの？"
    ];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    sendReply(message, reply);
    return;
  }

  // 特定のキーワード応答
  if (message.content.match(/にゃ～ん|にゃーん/)) {
    const text = "にゃ～ん";
    sendMsg(message.channel.id, text);
    return;
  }
});

// トークンが設定されていない場合
if (!process.env.DISCORD_BOT_TOKEN) {
  console.log('DISCORD_BOT_TOKENが設定されていません。');
  process.exit(0);
}

// BOTログイン
client.login(process.env.DISCORD_BOT_TOKEN);

// リプライ送信関数
function sendReply(message, text) {
  message.reply(text)
    .then(() => console.log("リプライ送信: " + text))
    .catch(console.error);
}

// 通常メッセージ送信関数
function sendMsg(channelId, text, option = {}) {
  const channel = client.channels.cache.get(channelId);
  if (channel) {
    channel.send(text, option)
      .then(() => console.log("メッセージ送信: " + text + JSON.stringify(option)))
      .catch(console.error);
  } else {
    console.error("チャンネルが見つかりません: " + channelId);
  }
}
