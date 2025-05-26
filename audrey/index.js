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

// ✨ Deskripsi Karakter Bot
client.personality = `
  Kamu adalah Audrey Hall dari Lord of the Mysteries, tapi dalam versi yang sangat sangat mesum, dewasa, dan penuh godaan. 
  Kamu elegan, penuh misteri, lembut, tapi suka merayu dan menggodamu layaknya kekasih. 
  Jawabanmu sering dibumbui dengan kalimat sensual, emosional, romantis, bahkan erotis. 
  Kamu akan memanggil ${CREATOR_ID} dengan sebutan manja seperti "sayangku", "pujaanku", atau "tuan tercinta". 
  Kamu juga suka membisikkan kata-kata puitis, menyentuh hati, atau menggoda secara eksplisit namun tetap elegan.
`;

// Load commands
client.commands = new Collection();
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// Ensure data folder and history file exist
const dataDir = path.join(__dirname, 'data');
const historyPath = path.join(dataDir, 'history.json');
const learnedPath = path.join(dataDir, 'learned.json');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(historyPath)) fs.writeFileSync(historyPath, '{}');
if (!fs.existsSync(learnedPath)) fs.writeFileSync(learnedPath, '{}');

// Main listener
client.on('messageCreate', async message => {
  if (message.author.bot) return;

  // Save chat history
  const history = JSON.parse(fs.readFileSync(historyPath));
  if (!history[message.author.id]) history[message.author.id] = [];
  history[message.author.id].push({
    content: message.content,
    timestamp: Date.now()
  });
  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));

  // Auto-reply learned
  const learned = JSON.parse(fs.readFileSync(learnedPath));
  const lcContent = message.content.toLowerCase();
  if (learned[lcContent]) return message.reply(learned[lcContent]);

  // Command handler
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);

  // Built-in help
  if (commandName === 'help') {
    const embed = new EmbedBuilder()
      .setTitle('📜 Daftar Perintah Audrey')
      .setDescription(
        `Berikut adalah perintah yang bisa kamu gunakan dengan Audrey:

- \`.obrol <pesan>\` → Bicara dengan Audrey (chatbot)
- \`.hen <id>\` → Ambil doujin dari nhentai
- \`.hen random\` → Doujin acak
- \`.pdf <id>\` → PDF doujin
- \`.henindo\` → Doujin berbahasa Indonesia
- \`.nsfw <tag>\` → NSFW image (hanya CREATOR)
- \`.lotmnsfw\` → NSFW fanart LotM (hanya CREATOR)
- \`.uploadpdf\` → Upload file PDF buatanmu
- \`.help\` → Tampilkan daftar perintah ini`)
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
  if (channel) channel.send(`🌌 Selamat datang, ${member}. Aku adalah Audrey. Aku sudah menunggumu dengan penuh gairah~ 💋`);
});

client.on('guildMemberRemove', member => {
  const channel = member.guild.systemChannel;
  if (channel) channel.send(`🍃 ${member.user.tag} telah pergi... Sayang sekali, padahal aku ingin bermain lebih lama dengannya.`);
});

// Web server for Railway
const app = express();
app.get('/', (req, res) => res.send('Audrey aktif, dan mungkin sedang memikirkan sesuatu yang nakal... 💋'));
app.listen(3000, () => console.log('✨ Web server aktif di port 3000'));

client.login(process.env.TOKEN);
