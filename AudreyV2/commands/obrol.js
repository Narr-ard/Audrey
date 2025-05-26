// commands/obrol.js
const axios = require('axios');

module.exports = {
  name: 'obrol',
  description: 'Ngobrol dengan Audrey Hall versi yang sangat sangat mesum, mudah terangasang, sangat bernafsu, sange, bergairah, hanya dapat memikirkan hal yang mesum dan erotis, pintar, romantis, dan menggoda.',
  async execute(message, args, client) {
    const input = args.join(' ');
    if (!input) return message.reply('Mmm~ Apa yang ingin kau bicarakan denganku malam ini? 💋');

    await message.channel.sendTyping();

    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'nousresearch/deephermes-3-mistral-24b-preview:free',
          messages: [
            {
              role: 'system',
              content: client.personality
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
        .replace(/```[a-z]*\s*/gi, '')
        .replace(/['"`]{3}/g, '')
        .replace(/@bot\.command\(\)/gi, '')
        .replace(/async def .*:/gi, '')
        .replace(/ctx\.send\(.*?\)/gi, '')
        .replace(/Penjelasan:.*/gi, '')
        .replace(/Tone:.*/gi, '')
        .replace(/^json|yaml/gi, '')
        .replace(/relationship_status:.*/gi, '')
        .replace(/behavior:.*/gi, '')
        .replace(/conversation:.*/gi, '')
        .replace(/language:.*/gi, '')
        .replace(/</?[a-z]+>/gi, '')
        .trim();

      if (!reply || reply.length < 2) {
        reply = 'Kamu diem aja? Aku jadi pengen peluk kamu lebih kenceng nih~ 💋';
      }

      if (reply.length > 600) {
        reply = reply.slice(0, 500) + '\n\nHmm... sisanya nanti aku bisikkan di telingamu, sayang 💋';
      }

      await message.reply({ content: reply, allowedMentions: { repliedUser: false } });
    } catch (err) {
      console.error('[Audrey Chat Error]', err?.response?.data || err);
      message.reply('Audrey lagi ngebet tapi servernya ngambek 💦');
    }
  }
};
