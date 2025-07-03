const http = require('http');
const querystring = require('querystring');
const axios = require("axios");
const Discord = require("discord.js");
const client = new Discord.Client();

const PORT = process.env.PORT || 3000;
const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN;
const HF_API_TOKEN = process.env.HF_API_TOKEN;

// HTTPサーバー（Renderでスリープ防止）
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is alive!');
}).listen(PORT);

// 起動時
client.on("ready", () => {
  console.log("Bot準備完了～");
  client.user.setPresence({ activity: { name: 'GPT-2でおしゃべり中' } });
});

// メッセージ受信時
client.on("message", async (message) => {
  if (message.author.bot) return;

  // メンションされたときにランダム応答
  if (message.mentions.has(client.user)) {
    const replies = [
      "なんでご飯呼んでくれなかったの？",
      "なんでマック行くとき声かけてくれなかったの？"
      "なんでラーメンてつ行くとき声かけてくれなかったの？"
　    "なんで山岡家行くとき声かけてくれなかったの？"
　    "なんで風俗行くとき声かけてくれなかったの？"
　    "なんでコンビニ行くとき声かけてくれなかったの？"

    ];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    message.reply(reply);
    return;
  }

  // 通常メッセージには GPT-2 の返事を返す
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/gpt2", // GPT-2のモデル
      { inputs: message.content },
      {
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
        },
        timeout: 20000
      }
    );

    const reply = response.data[0]?.generated_text || "うまく返せなかったよ〜";
    message.channel.send(reply);

  } catch (err) {
    console.error("GPTエラー:", err.response?.data || err.message);
    message.channel.send("⚠ GPTの応答でエラーが発生したよ！");
  }
});

// トークン確認とログイン
if (!DISCORD_TOKEN) {
  console.log("DISCORD_BOT_TOKEN が設定されていません。");
  process.exit(1);
}
client.login(DISCORD_TOKEN);
