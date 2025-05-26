const axios = require('axios');

module.exports = {
  name: 'hentag',
  description: 'Cari doujin berdasarkan tag.',
  async execute(message, args) {
    const tag = args.join(' ');
    if (!tag) return message.reply('Masukkan tag terlebih dahulu. Contoh: `.hentag yuri`');

    const url = `https://nhentai.net/search/?q=${encodeURIComponent(tag)}`;
    const galleryId = Math.floor(Math.random() * (575000 - 100000) + 100000);

    try {
      const res = await axios.get(`https://nhentai.net/api/gallery/${galleryId}`);
      const data = res.data;

      const title = data.title.english || data.title.pretty;
      const imageUrl = `https://t.nhentai.net/galleries/${data.media_id}/cover.jpg`;
      const tags = data.tags.map(t => t.name).join(', ');

      return message.channel.send({
        embeds: [
          {
            title: title,
            url: `https://nhentai.net/g/${galleryId}`,
            image: { url: imageUrl },
            description: `🏷️ ${tags}`,
            footer: { text: `ID: ${galleryId}` },
            color: 0xff5588
          }
        ]
      });
    } catch (err) {
      console.error(err);
      return message.reply('Doujin tidak ditemukan.');
    }
  }
};
