module.exports = {
  name: 'lotmnsfw',
  description: 'NSFW Fanart dari karakter Lord of the Mysteries (khusus CREATOR)',
  async execute(message) {
    if (message.author.id !== process.env.CREATOR_ID) {
      return message.reply('Perintah ini hanya untuk penciptaku... 💋');
    }

    const links = [
      'https://www.pixiv.net/en/artworks/104151270',
      'https://www.pixiv.net/en/artworks/105942387',
      'https://www.pixiv.net/en/artworks/121995068',
      'https://www.pixiv.net/en/artworks/120876200',
      'https://www.pixiv.net/en/artworks/99486915',
      'https://www.pixiv.net/en/artworks/89592703'
    ];

    const thumbnails = [
      'https://i.pixiv.re/img-original/img/2023/10/01/00/06/50/104151270_p0.jpg',
      'https://i.pixiv.re/img-original/img/2023/12/24/00/15/32/105942387_p0.jpg',
      'https://i.pixiv.re/img-original/img/2024/05/10/00/05/04/121995068_p0.jpg',
      'https://i.pixiv.re/img-original/img/2024/03/18/00/17/26/120876200_p0.jpg',
      'https://i.pixiv.re/img-original/img/2022/10/10/00/01/14/99486915_p0.jpg',
      'https://i.pixiv.re/img-original/img/2021/06/10/00/02/57/89592703_p0.jpg'
    ];

    const index = Math.floor(Math.random() * links.length);

    await message.channel.send({
      embeds: [
        {
          title: '🔞 NSFW LotM Fanart',
          description: 'Gambar ini... hanya untukmu, pujaanku~ 💋',
          url: links[index],
          image: { url: thumbnails[index] },
          color: 0xdd3e6e
        }
      ]
    });
  }
};
