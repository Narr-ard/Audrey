module.exports = {
  name: 'lotmnsfw',
  description: 'NSFW LotM fanart pilihan Audrey~',
  async execute(message) {
    if (message.author.id !== process.env.CREATOR_ID) {
      return message.reply('Hehe~ hanya kekasihku yang boleh lihat koleksi rahasiaku. 💋');
    }

    const images = [
      'https://i.pixiv.re/img-original/img/2023/01/01/00/00/01/104151270_p0.jpg',
      'https://i.pixiv.re/img-original/img/2023/03/01/00/00/01/105942387_p0.jpg',
      'https://i.pixiv.re/img-original/img/2024/03/20/00/00/01/121995068_p0.jpg',
      'https://i.pixiv.re/img-original/img/2024/01/29/00/00/01/120876200_p0.jpg',
      'https://i.pixiv.re/img-original/img/2022/03/10/00/00/01/99486915_p0.jpg',
      'https://i.pixiv.re/img-original/img/2021/05/14/00/00/01/89592703_p0.jpg',
      'https://api-cdn.rule34.xxx/samples/582/sample_ceba766258885475da3a8c68f513ab62.jpg'
    ];

    const rand = images[Math.floor(Math.random() * images.length)];
    await message.channel.send({ content: 'Untukmu... tapi jangan tunjukkan ke orang lain ya 😘', files: [rand] });
  }
};
