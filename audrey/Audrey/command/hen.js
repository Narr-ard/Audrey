const axios = require('axios');

module.exports = {
  name: 'hen',
  description: 'Ambil doujin dari nhentai berdasarkan ID atau random.',
  async execute(message, args) {
    const id = args[0] === 'random'
      ? Math.floor(Math.random() * (571024 - 100000) + 100000)
      : args[0];

    try {
      const res = await axios.get(`https://nhentai.net/api/gallery/${id}`);
      const data = res.data;

      const title = data.title.pretty;
      const tags = data.tags.map(t => t.name).join(', ');
      const url = `https://nhentai.net/g/${id}`;
      const cover = `https://t.nhentai.net/galleries/${data.media_id}/cover.jpg`;

      await message.channel.send({
        content: `**${title}**\n🔗 ${url}\n📚 ${data.num_pages} halaman\n🏷️ ${tags}`,
        files: [cover]
      });

    } catch (err) {
      console.error(err);
      message.reply('Doujin tidak ditemukan atau error saat fetch.');
    }
  }
};
