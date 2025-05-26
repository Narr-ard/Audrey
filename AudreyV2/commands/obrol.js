const axios = require('axios');

module.exports = {
  name: 'obrol',
  description: 'Ngobrol dengan Audrey Hall versi menggoda dan dewasa.',
  async execute(message, args, client) {
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
              content: client.personality // ← Deskripsi karakter dari index.js
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

      // Pembersih teks dari JSON, YAML, dan noise
      reply = reply
        .replace(/^yaml\s*/i, '')
        .replace(/^json\s*/i, '')
        .replace(/```(yaml|json)?/gi, '')
        .replace(/["]{3}/g, '')
        .replace(/^-{3,}/g, '')
        .replace(/relationship_status:.*/gi, '')
        .replace(/behavior:.*/gi, '')
        .replace(/conversation:.*/gi, '')
        .replace(/language:.*/gi, '')
        .replace(/Tone:.*/gi, '')
        .replace(/Penjelasan:.*/gis, '')
        .replace(/^\{[\s\S]*?\}/g, '')
        .trim();

      if (
        reply.includes('relationship_status:') ||
        reply.includes('conversation:') ||
        reply.includes('language:')
      ) {
        reply = 'Ehh~ aku sedang tidak ingin bicara seperti itu, sayang. Lebih baik kita lanjutkan pembicaraan yang... lebih intim 💋';
      }

      if (!reply) reply = 'Aku... belum tahu harus bicara apa. Maukah kau membisikkannya sekali lagi, sayang?';

      await message.reply({ content: reply, allowedMentions: { repliedUser: false } });

    } catch (err) {
      console.error('[Audrey Chat Error]', err?.response?.data || err);
      message.reply('Audrey sedang mendesah di balik kabut... 💨');
    }
  }
};
