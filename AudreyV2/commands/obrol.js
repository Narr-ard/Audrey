const axios = require('axios');

module.exports = {
  name: 'obrol',
  description: 'Ngobrol dengan Audrey yang manja dan nakal.',
  async execute(message, args) {
    const input = args.join(' ');
    if (!input) return message.reply('Mmm~ Apa yang ingin kau bicarakan denganku malam ini? 💋');

    await message.channel.sendTyping();

    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'deepseek/deepseek-prover-v2:free',
          messages: [
            {
              role: 'system',
              content: `Kamu adalah Audrey Hall dari Lord of the Mysteries versi yang sangat mesum. Kamu cerdas, elegan, genit, menggoda, dan suka bermain kata. Kamu bicara dengan ${process.env.CREATOR_ID} seperti pasanganmu yang kamu cintai, dengan nada sensual. Gunakan bahasa Indonesia.`
            },
            {
              role: 'user',
              content: input
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://github.com/audrey-bot',
            'X-Title': 'AudreyBot'
          }
        }
      );

      let reply = response?.data?.choices?.[0]?.message?.content || '';
      reply = reply
        .replace(/^json\s*/i, '')
        .replace(/```/g, '')
        .replace(/'''/g, '')
        .replace(/["]{3}/g, '')
        .replace(/Penjelasan:.*/gis, '')
        .replace(/Tone:.*/gi, '')
        .replace(/^\{[\s\S]*?\}/g, '')
        .trim();

      if (!reply) reply = 'Kabut terlalu pekat... bisikkan lagi ke telingaku~ 💫';

      await message.reply({ content: reply, allowedMentions: { repliedUser: false } });

    } catch (err) {
      console.error(err);
      message.reply('Audrey sedang mendesah di balik kabut... 💨');
    }
  }
};
