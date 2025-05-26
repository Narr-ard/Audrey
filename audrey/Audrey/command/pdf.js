const axios = require('axios');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

module.exports = {
  name: 'pdf',
  description: 'Download doujin sebagai PDF.',
  async execute(message, args) {
    const id = args[0];
    if (!id) return message.reply('Masukkan ID doujin, contoh: `.pdf 177013`');

    try {
      const res = await axios.get(`https://nhentai.net/api/gallery/${id}`);
      const data = res.data;
      const pages = data.images.pages;
      const mediaId = data.media_id;

      const pdfDoc = await PDFDocument.create();

      for (let i = 0; i < pages.length; i++) {
        const ext = pages[i].t === 'j' ? 'jpg' : 'png';
        const imgUrl = `https://i.nhentai.net/galleries/${mediaId}/${i + 1}.${ext}`;
        const imgRes = await axios.get(imgUrl, { responseType: 'arraybuffer' });

        const imgBytes = imgRes.data;
        const img = ext === 'jpg'
          ? await pdfDoc.embedJpg(imgBytes)
          : await pdfDoc.embedPng(imgBytes);

        const page = pdfDoc.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }

      const pdfBytes = await pdfDoc.save();
      const filePath = `./audrey_temp_${id}.pdf`;
      fs.writeFileSync(filePath, pdfBytes);

      await message.channel.send({ content: `PDF doujin ${id}:`, files: [filePath] });

      fs.unlinkSync(filePath);

    } catch (err) {
      console.error(err);
      message.reply('Gagal membuat PDF. Coba ID lain.');
    }
  }
};
