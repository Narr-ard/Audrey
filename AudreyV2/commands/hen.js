const axios = require('axios');

module.exports = {
  name: 'hen',
  description: 'Ambil doujin dari nhentai berdasarkan ID atau random.',
  async execute(message, args) {
    const minId = 100000;
    const baseMax = 575333;
    const startDate = new Date('2024-01-01');
    const daysPassed = Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const maxId = baseMax + (daysPassed * 5);

    let id = args[0];
    let data;
    let found = false;

    for (let i = 0; i < 10 && !found; i++) {
      if (!id || id === 'random') {
        id = Math.floor(Math.random() * (maxId - minId + 1)) + minId;
      }
      try {
        const res = await axios.get(`https://nhentai.net/api/gallery/${id}`);
        data = res.data;
        found = true;
      } catch {
        id = null;
      }
    }

    if (!data) return message.reply('Doujin tidak ditemukan setelah beberapa percobaan.');

    const title = data.title?.english || data.title.pretty;
    const url = `https://nhentai.net/g/${id}`;
    const imageUrl = `https://t.nhentai.net/galleries/${data.media_id}/cover.jpg`;
    const tags = data.tags.map(t => t.name).join(', ');

    await message.reply({
      embeds: [
        {
          title: title,
          url: url,
          image: { url: imageUrl },
          description: `📚 ${data.num_pages} halaman\n🏷️ ${tags}`,
          footer: { text: `ID: ${id}` },
          color: 0xff3366
        }
      ]
    });
  }
};
