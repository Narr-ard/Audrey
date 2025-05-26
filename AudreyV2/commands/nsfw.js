const axios = require('axios');

module.exports = {
  name: 'nsfw',
  description: 'Cari gambar NSFW berdasarkan tag (khusus CREATOR)',
  async execute(message, args) {
    if (message.author.id !== process.env.CREATOR_ID) {
      return message.reply('Perintah ini hanya untuk penciptaku~ 💋');
    }

    const tag = args.join('_') || 'yuri';

    try {
      const res = await axios.get(`https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&tags=${encodeURIComponent(tag)}&limit=100`);
      const posts = res.data;

      if (!Array.isArray(posts) || posts.length === 0) {
        return message.reply('Tidak ada gambar ditemukan untuk tag itu.');
      }

      const post = posts[Math.floor(Math.random() * posts.length)];

      await message.channel.send({
        embeds: [
          {
            title: `NSFW: ${tag.replace(/_/g, ' ')}`,
            url: post.file_url,
            image: { url: post.sample_url || post.file_url },
            footer: { text: `Source: rule34.xxx` },
            color: 0xde3163
          }
        ]
      });
    } catch (err) {
      console.error('[NSFW error]', err?.response?.data || err);
      message.reply('Gagal mengambil gambar NSFW. Coba tag lain ya, sayang.');
    }
  }
};
