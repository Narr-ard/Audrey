const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'favorit',
  description: 'Simpan tag favorit hentai user',
  async execute(message, args) {
    const memoryPath = path.join(__dirname, '../data/memories.json');
    const memories = JSON.parse(fs.readFileSync(memoryPath));
    const userId = message.author.id;

    if (!args.length) return message.reply('Ketik: `.favorit yuri lingerie`');

    const tags = args.map(tag => tag.toLowerCase());
    memories[userId] = memories[userId] || {};
    memories[userId].favorite_tags = tags;

    fs.writeFileSync(memoryPath, JSON.stringify(memories, null, 2));
    message.reply(`Tag favorit kamu sudah kusimpan: ${tags.join(', ')}`);
  }
};
