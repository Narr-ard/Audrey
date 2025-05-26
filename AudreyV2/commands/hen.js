const axios = require('axios');

module.exports = {
  name: 'hen',
  description: 'Ambil doujin dari nhentai berdasarkan ID atau random terbatas.',
  async execute(message, args) {
    let id = args[0];
    const minId = 100000;
    const baseMax = 575333;
    const startDate = new Date('2024-01-01');

    // Hitung hari berjalan dari startDate
    const today = new Date();
    const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    const dynamicMax = baseMax + (daysPassed * 5); // 🔺 tambah 5 per hari

    const maxTries = 10;
    let doujinFound = false;
    let data = null;

    for (let i = 0; i < maxTries && !doujinFound; i++) {
      if (!id || id === 'random') {
        id = Math.floor(Math.random() * (dynamicMax - minId) + minId);
      }

      try {
        const res = await axios.get(`https://nhentai.net/api/gallery/${id}`);
        data = res.data;
        doujinFound = true;
      } catch (err) {
        continue;
      }
    }

    if (!doujinFound || !data) {
      return message.reply('Doujin tidak ditemukan setelah beberapa percobaan.');
    }

    const title = data.title.pretty;
    const tags = data.tags.map(t => t.name).join(', ');
    const url = `https://nhentai.net/g/${id}`;
    const cover = `https://t.nhentai.net/galleries/${data.media_id}/cover.jpg`;

    await message.channel.send({
      content: `**${title}**\n🔗 ${url}\n📚 ${data.num_pages} halaman\n🏷️ ${tags}`,
      files: [cover]
    });
  }
};
