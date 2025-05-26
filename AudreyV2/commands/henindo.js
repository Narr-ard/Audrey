const axios = require('axios');

module.exports = {
  name: 'henindo',
  description: 'Cari doujin berbahasa Indonesia dari nhentai.',
  async execute(message, args) {
    const maxTries = 10;

    for (let i = 0; i < maxTries; i++) {
      const id = Math.floor(Math.random() * (571024 - 100000) + 100000);
      try {
        const res = await axios.get(`https://nhentai.net/api/gallery/${id}`);
        const data = res.data;
        const hasIndo = data.tags.find(t => t.type === 'language' && t.name === 'indonesian');

        if (!hasIndo) continue;

        const title = data.title.pretty;
        const url = `https://nhentai.net/g/${id}`;
        const cover = `https://t.nhentai.net/galleries/${data.media_id}/cover.jpg`;

        return message.channel.send({
          content: `🇮🇩 **${title}**\n🔗 ${url}`,
          files: [cover]
        });

      } catch (_) {
        continue;
      }
    }

    return message.reply('Tidak ditemukan doujin berbahasa Indonesia setelah 10 percobaan.');
  }
};
