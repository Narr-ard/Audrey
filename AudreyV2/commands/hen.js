const axios = require('axios');

module.exports = {
  name: 'hen',
  description: 'Ambil doujin dari nhentai berdasarkan ID atau random dengan embed.',
  async execute(message, args) {
    const minId = 100000;
    const baseMax = 575333;
    const startDate = new Date('2024-01-01');
    const today = new Date();
    const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    const maxId = baseMax + (daysPassed * 5); // 🔼 bertambah 5 setiap hari

    let id = args[0];
    const maxTries = 10;
    let doujinFound = false;
    let data = null;

    for (let i = 0; i < maxTries && !doujinFound; i++) {
      if (!id || id === 'random') {
        id = Math.floor(Math.random() * (maxId - minId + 1) + minId);
      }

      try {
        const res = await axios.get(`https://nhentai.net/api/gallery/${id}`);
        if (res.status === 200) {
          data = res.data;
          doujinFound = true;
        }
      } catch (err) {
        id = null; // reset ID agar next loop bisa retry random
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
      embeds: [
        {
          title: title,
          url: url,
          image: { url: cover },
          description: `📚 **${data.num_pages} halaman**\n🏷️ ${tags}`,
          color: 0xff3366,
          footer: { text: `ID: ${id}` }
        }
      ]
    });
  }
};
