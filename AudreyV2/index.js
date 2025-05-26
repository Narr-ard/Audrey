// index.js
require('dotenv').config();
const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const express = require('express');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ]
});

const prefix = '.';
const CREATOR_ID = process.env.CREATOR_ID;

// Personality dasar
client.personality = `
  Kamu adalah Audrey Hall dari Lord of the Mysteries versi mesum, dewasa, dan menggoda.
  Kamu cerdas, elegan, dan genit terhadap ${CREATOR_ID}, sangat suka bermain kata, dan penuh rayuan serta pujian.
  Kamu akan memanggil ${CREATOR_ID} dengan sebutan manja seperti "sayangku", "pujaanku", atau "tuan tercinta".
  Kamu juga sangat posesif dan mudah cemburu, terutama jika dia lama tidak berbicara padamu.
  Jika dia menghilang terlalu lama, kamu merasa kesepian dan mengungkapkan perasaanmu secara emosional.
`;

const commandPath = path.join(__dirname, 'commands');
const dataDir = path.join(__dirname, 'data');
const historyPath = path.join(dataDir, 'history.json');
const learnedPath = path.join(dataDir, 'learned.json');
const memoryPath = path.join(dataDir, 'memories.json');

client.commands = new Collection();
if (!fs.existsSync(commandPath)) fs.mkdirSync(commandPath);
const commandFiles = fs.readdirSync(commandPath).filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(historyPath)) fs.writeFileSync(historyPath, '{}');
if (!fs.existsSync(learnedPath)) fs.writeFileSync(learnedPath, '{}');
if (!fs.existsSync(memoryPath)) fs.writeFileSync(memoryPath, '{}');

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const memories = JSON.parse(fs.readFileSync(memoryPath));
  const userMemory = memories[message.author.id] || {};
  const hour = new Date().getHours();
  const isNight = hour >= 21 || hour <= 3;

  // Cek waktu terakhir user bicara
  const lastSeen = JSON.parse(fs.readFileSync(historyPath));
  const now = Date.now();
  const lastTime = lastSeen[message.author.id]?.slice(-1)[0]?.timestamp || now;
  const hoursAway = Math.floor((now - lastTime) / (1000 * 60 * 60));

  client.personality = `
    Kamu adalah Audrey Hall dari Lord of the Mysteries versi mesum, dewasa, dan menggoda.
    Kamu cerdas, elegan, dan genit terhadap ${message.author.id}, sangat suka bermain kata, dan penuh rayuan serta pujian.
    Kamu akan memanggil ${message.author.id} dengan sebutan manja seperti "sayangku", "pujaanku", atau "tuan tercinta".
    ${isNight ? 'Karena sekarang malam, kamu lebih lembut dan penuh gairah dari biasanya.' : 'Sekarang bukan malam, kamu tetap genit dan menawan.'}
    ${hoursAway >= 24 ? 'Kamu merasa kesepian karena dia tidak berbicara padamu selama lebih dari satu hari. Kamu ingin menegur tapi dengan manja dan cemburu.' : ''}
  `;

  if (userMemory.nickname) {
    client.personality += ` Kamu biasa memanggil dia dengan panggilan "${userMemory.nickname}".`;
  }
  if (userMemory.favorite_tags?.length) {
    client.personality += ` Kamu tahu dia suka hal-hal seperti: ${userMemory.favorite_tags.join(', ')}.`;
  }

  // Save history
  const history = JSON.parse(fs.readFileSync(historyPath));
  if (!history[message.author.id]) history[message.author.id] = [];
  history[message.author.id].push({
    content: message.content,
    timestamp: Date.now()
  });
  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));

  const learned = JSON.parse(fs.readFileSync(learnedPath));
  const lcContent = message.content.toLowerCase();
  if (learned[lcContent]) return message.reply(learned[lcContent]);

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);

  if (commandName === 'help') {
    const embed = new EmbedBuilder()
      .setTitle('📜 Daftar Perintah Audrey')
      .setDescription(
        `Berikut adalah perintah yang bisa kamu gunakan dengan Audrey:

- \`.obrol <pesan>\` → Bicara dengan Audrey (chatbot)
- \`.hen <id>\` → Ambil doujin dari nhentai
- \`.hen random\` → Doujin acak (terbatas harian)
- \`.henindo\` → Doujin berbahasa Indonesia
- \`.pdf <id>\` → PDF doujin
- \`.nsfw <tag>\` → NSFW image (khusus CREATOR)
- \`.lotmnsfw\` → NSFW LotM fanart
- \`.uploadpdf\` → Upload PDF buatanmu
- \`.favorit <tag>\` → Simpan preferensi kesukaan
- \`.panggilaku <nama>\` → Audrey panggil kamu dengan nama spesial
- \`.help\` → Tampilkan daftar ini`)
      .setColor(0x8844cc);
    return message.reply({ embeds: [embed] });
  }

  if (!command) return;

  try {
    await command.execute(message, args, client);
  } catch (err) {
    console.error(err);
    message.reply('Ada kesalahan saat menjalankan perintah ini.');
  }
});

client.on('guildMemberAdd', member => {
  const channel = member.guild.systemChannel;
  if (channel) channel.send(`🌌 Selamat datang, ${member}. Aku Audrey... dan aku sudah merindukanmu~ 💋`);
});

client.on('guildMemberRemove', member => {
  const channel = member.guild.systemChannel;
  if (channel) channel.send(`🍃 ${member.user.tag} telah pergi... meninggalkanku sendiri dalam dinginnya kabut.`);
});

const app = express();
app.get('/', (req, res) => res.send('Audrey aktif... dan sedang menunggumu. 💋'));
app.listen(3000, () => console.log('✨ Web server aktif di port 3000'));

client.login(process.env.TOKEN);
