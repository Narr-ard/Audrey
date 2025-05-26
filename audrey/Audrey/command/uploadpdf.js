module.exports = {
  name: 'uploadpdf',
  description: 'Upload PDF doujin (CREATOR only)',
  async execute(message) {
    if (message.author.id !== process.env.CREATOR_ID) return;

    const attachment = message.attachments.first();
    if (!attachment || !attachment.name.endsWith('.pdf')) {
      return message.reply('Tolong kirim file PDF sebagai attachment bersamaan dengan perintah ini.');
    }

    await message.channel.send({
      content: `📕 PDF doujin yang kau titipkan, Tuan~`,
      files: [attachment.url]
    });
  }
};
