// commands/obrol.js
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
        .replace(/@bot\.command\(\)/gi, '')
        .replace(/async def .*:/gi, '')
        .replace(/ctx\.send\(.*?\)/gi, '')
        .replace(/['"`]{3}/g, '')
        .replace(/Penjelasan:.*/gi, '')
        .replace(/Tone:.*/gi, '')
        .replace(/^json|yaml/gi, '')
        .replace(/relationship_status:.*/gi, '')
        .replace(/behavior:.*/gi, '')
        .replace(/conversation:.*/gi, '')
        .replace(/language:.*/gi, '')
        .trim();

      if (
        reply.includes('def ') ||
        reply.includes('@bot.') ||
        reply.includes('```')
      ) {
        reply = 'Jangan main-main denganku dengan kode seperti itu, sayang... bicara padaku seperti kekasihmu, bukan programmu~ 💋';
      }

      if (!reply) reply = 'Aku... belum tahu harus bicara apa. Maukah kau membisikkannya sekali lagi, sayang?';

      await message.reply({ content: reply, allowedMentions: { repliedUser: false } });

    } catch (err) {
      console.error('[Audrey Chat Error]', err?.response?.data || err);
      message.reply('Audrey sedang mendesah di balik kabut... 💨');
    }
  }
};
