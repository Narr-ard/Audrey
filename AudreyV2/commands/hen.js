// commands/hen.js
const axios = require('axios');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'hen',
  description: 'Ambil doujin dari nhentai berdasarkan ID atau random dengan navigasi gambar.',
  async execute(message, args) {
    const minId = 100000;
    const baseMax = 575333;
    const startDate = new Date('2024-01-01');
    const today = new Date();
    const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    const maxId = baseMax + (daysPassed * 5);

    let id = args[0];
    let data = null;
    let found = false;

    for (let i = 0; i < 10 && !found; i++) {
      if (!id || id === 'random') {
        id = Math.floor(Math.random() * (maxId - minId + 1)) + minId;
      }

      try {
        const res = await axios.get(`https://nhentai.net/api/gallery/${id}`);
        if (res.status === 200) {
          data = res.data;
          found = true;
        }
      } catch {
        id = null;
      }
    }

    if (!data) return message.reply('Doujin tidak ditemukan setelah beberapa percobaan.');

    const title = data.title.pretty || data.title.english || 'Tanpa Judul';
    const url = `https://nhentai.net/g/${data.id}`;
    const pages = data.num_pages;
    const mediaId = data.media_id;
    const tags = data.tags.map(t => t.name).join(', ');

    let page = 1;
    const imageUrl = (p) => `https://i.nhentai.net/galleries/${mediaId}/${p}.jpg`;

    const embed = new EmbedBuilder()
      .setTitle(`${title} (halaman ${page}/${pages})`)
      .setURL(url)
      .setImage(imageUrl(page))
      .setDescription(`📚 ${pages} halaman\n🏷️ ${tags}`)
      .setColor(0xff3366)
      .setFooter({ text: `ID: ${data.id}` });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('prev').setLabel('⏪').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('next').setLabel('⏩').setStyle(ButtonStyle.Secondary)
    );

    const msg = await message.channel.send({ embeds: [embed], components: [row] });

    const collector = msg.createMessageComponentCollector({
      filter: i => i.user.id === message.author.id,
      time: 60000
    });

    collector.on('collect', async interaction => {
      if (interaction.customId === 'next' && page < pages) page++;
      else if (interaction.customId === 'prev' && page > 1) page--;

      const updatedEmbed = EmbedBuilder.from(embed)
        .setTitle(`${title} (halaman ${page}/${pages})`)
        .setImage(imageUrl(page));

      await interaction.update({ embeds: [updatedEmbed], components: [row] });
    });

    collector.on('end', () => {
      msg.edit({ components: [] });
    });
  }
};
