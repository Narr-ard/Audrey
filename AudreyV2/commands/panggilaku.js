const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'panggilaku',
  description: 'Set panggilan kesayangan yang Audrey gunakan untukmu',
  async execute(message, args) {
    const memoryPath = path.join(__dirname, '../data/memories.json');
    const memories = JSON.parse(fs.readFileSync(memoryPath));
    const userId = message.author.id;

    if (!args.length) return message.reply('Contoh: `.panggilaku pujaanku`');

    const nickname = args.join(' ');
    memories[userId] = memories[userId] || {};
    memories[userId].nickname = nickname;

    fs.writeFileSync(memoryPath, JSON.stringify(memories, null, 2));
    message.reply(`Mulai sekarang, aku akan memanggilmu: **${nickname}** 💋`);
  }
};
