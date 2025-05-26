module.exports = {
  name: 'lotmnsfw',
  description: 'NSFW fanart Lord of the Mysteries (khusus CREATOR)',
  async execute(message) {
    if (message.author.id !== process.env.CREATOR_ID) {
      return message.reply('Perintah ini hanya untuk penciptaku, sayang... 💋');
    }

    const images = [
      // 🔞 Pixiv Fanart
      {
        url: 'https://www.pixiv.net/en/artworks/104151270',
        img: 'https://i.pixiv.re/img-original/img/2023/10/01/00/06/50/104151270_p0.jpg'
      },
      {
        url: 'https://www.pixiv.net/en/artworks/105942387',
        img: 'https://i.pixiv.re/img-original/img/2023/12/24/00/15/32/105942387_p0.jpg'
      },
      {
        url: 'https://www.pixiv.net/en/artworks/121995068',
        img: 'https://i.pixiv.re/img-original/img/2024/05/10/00/05/04/121995068_p0.jpg'
      },

      // 🔞 Rule34 Fanart
      { url: '', img: 'https://api-cdn.rule34.xxx/samples/2663/sample_ec729fc4d8e610f0419358d2d857a41d.jpg' },
      { url: '', img: 'https://api-cdn.rule34.xxx/samples/2663/sample_19f6c9cfedcc22d70b244eadc7baff6d.jpg' },
      { url: '', img: 'https://api-cdn.rule34.xxx/samples/2663/sample_9923bd14fd14d14f7527a7ae8633ec1a.jpg' },
      { url: '', img: 'https://api-cdn.rule34.xxx/images/2567/1702720a060d5e6ca96cc979dd56301f.jpeg' },
      { url: '', img: 'https://api-cdn.rule34.xxx/samples/2663/sample_340c431fd4363fd38c908a4810d567dc.jpg' },
      { url: '', img: 'https://api-cdn.rule34.xxx/images/1353/7219534c0152b2210fd4863cf0471447.png' },
      { url: '', img: 'https://api-cdn.rule34.xxx/images/2663/0111b2ddbe1f1aee7b748a849a7ad222.jpeg' },
      { url: '', img: 'https://api-cdn.rule34.xxx/samples/2663/sample_685c07b4ec8d2faf6a6cd4be90870248.jpg' },
      { url: '', img: 'https://api-cdn.rule34.xxx/samples/3555/sample_1269584c178b94f09aaeb407d77a9fe1.jpg' },
      { url: '', img: 'https://api-cdn.rule34.xxx/samples/582/sample_77aae9b5c4772e86496bfc73138bee73.jpg' },
      { url: '', img: 'https://api-cdn.rule34.xxx/samples/3283/sample_f7f8b84dccd5eaff3c71330ac689ef50.jpg' }
    ];

    const pick = images[Math.floor(Math.random() * images.length)];

    await message.channel.send({
      embeds: [
        {
          title: '🔞 NSFW Fanart LotM',
          url: pick.url || undefined,
          image: { url: pick.img },
          description: 'Karya penuh gairah... hanya untukmu, pujaanku 💋',
          color: 0xdd3e6e
        }
      ]
    });
  }
};
