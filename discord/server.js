const http = require('http');
const querystring = require('querystring');
const axios = require("axios");
const Discord = require("discord.js");
const client = new Discord.Client();

// HTTPサーバー（Render 起動維持用）
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is alive!');
}).listen(PORT);

// 環境変数からトークン取得
const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN;
const HF_API_TOKEN = process.env.HF_API_TOKEN;

// BOT起動時
client.on("ready", () => {
  console.log("Bot準備完了～");
  client.user.setPresence({ activity: { name: 'GPT-2でおしゃべり中' } });
});

// メッセージ受信時
client.on("message", async (message) => {
  if (message.author.bot) return;

  const prompt = message.content;

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/gpt2",
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
        },
        timeout: 20000, // 応答遅延対策
      }
    );

    const reply = response.data[0]?.generated_text || "うまく返せなかったよ～";
    message.channel.send(reply);
  } catch (err) {
    console.error("GPTエラー:", err.response?.data || err.message);
    message.channel.send("⚠ GPTの応答でエラーが発生したよ！");
  }
});

// Discord BOTログイン
if (!DISCORD_TOKEN) {
  console.log("DISCORD_BOT_TOKEN が設定されていません。");
  process.exit(1);
}
client.login(DISCORD_TOKEN);
