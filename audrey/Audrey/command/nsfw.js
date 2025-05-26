const axios = require('axios');

module.exports = {
  name: 'nsfw',
  description: 'Gambar NSFW berdasarkan tag.',
  async execute(message, args) {
    if (message.author.id !== process.env.CREATOR_ID) {
      return message.reply('Perintah ini hanya untuk penciptaku~ 💋');
    }

    const tag = args.join(' ') || 'thighs';

    try {
      const res = await axios.get(`https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&tags=${encodeURIComponent(tag)}`);
      const posts = res.data;
      if (!posts || posts.length === 0) return message.reply('Tidak ada gambar ditemukan.');

      const rand = posts[Math.floor(Math.random() * posts.length)];
      await message.channel.send(`${rand.file_url}`);

    } catch (err) {
      console.error(err);
      message.reply('Gagal mengambil konten NSFW.');
    }
  }
};
