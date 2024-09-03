const openai = require('openai');

const apiKey = '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';
const client = new openai(apiKey);

async function generateNewMessage(recentMessages) {
  try {
    if (!Array.isArray(recentMessages)) {
      throw new Error('Ошибка: Не удалось получить последние сообщения или они не являются массивом.');
    }

    const prompt = recentMessages.map(message => message.content).join(' ');

    console.warn("Отправка запроса на генерацию...");

    const response = await client.createCompletion({
      model: 'gpt-3.5-turbo',
      prompt: prompt,
      max_tokens: 100,
      stop: ['\n'],
      temperature: 0.7,
    });

    console.error("Ответ от OpenAI:", response);

    if (response.choices && response.choices.length > 0) {
      const newMessage = response.choices[0].text.trim();

      if (newMessage !== "") {
        console.error("Получено новое сообщение:", newMessage);
      } else {
        console.error("Ответ от OpenAI не содержит ожидаемых данных.");
      }
    } else {
      console.error("Ответ от OpenAI не содержит ожидаемых данных.");
    }
  } catch (error) {
    console.error("Произошла ошибка при генерации сообщения: ", error);
  }
}

const recentMessages = [
  { role: 'user', content: '' },
  { role: 'assistant', content: '' }
];

generateNewMessage(recentMessages);