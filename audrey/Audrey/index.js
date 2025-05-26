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

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// Memory file for chat history
const historyPath = path.join(__dirname, 'data/history.json');
if (!fs.existsSync(historyPath)) fs.writeFileSync(historyPath, JSON.stringify({}));

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

  // Auto-reply dari learned.json
  const learnedPath = path.join(__dirname, 'data/learned.json');
  if (fs.existsSync(learnedPath)) {
    const learned = JSON.parse(fs.readFileSync(learnedPath));
    if (learned[message.content.toLowerCase()]) {
      return message.reply(learned[message.content.toLowerCase()]);
    }
  }

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);
  if (!command) return;

  // .help command built-in
  if (commandName === 'help') {
    const embed = new EmbedBuilder()
      .setTitle('📜 Daftar Perintah Audrey')
      .setDescription('Berikut adalah perintah yang bisa kamu gunakan dengan Audrey:\n\n' +
        '- `.obrol <pesan>` → Bicara dengan Audrey (chatbot)\n' +
        '- `.hen <id>` → Ambil doujin dari nhentai\n' +
        '- `.hen random` → Doujin acak\n' +
        '- `.pdf <id>` → PDF doujin\n' +
        '- `.nsfw <tag>` → NSFW image (hanya CREATOR)\n' +
        '- `.lotmnsfw` → NSFW fanart LotM (hanya CREATOR)\n' +
        '- `.help` → Menampilkan daftar ini')
      .setColor(0x8844cc);

    return message.reply({ embeds: [embed] });
  }

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

// Web server for UptimeRobot / Railway
const app = express();
app.get('/', (req, res) => res.send('Audrey aktif, dan mungkin sedang memikirkan sesuatu yang nakal... 💋'));
app.listen(3000, () => console.log('✨ Web server aktif di port 3000'));

client.login(process.env.TOKEN);
