class MessagesAnalysisError extends Error {
  constructor(message) {
    super(message);
    this.name = 'MessagesAnalysisError';
  }
}

function getChatMessages() {
  try {
    const messageContainer = document.querySelector('.MessageList, .messages-layout');
    if (!messageContainer) {
      throw new MessagesAnalysisError('Не удалось найти контейнер сообщений.');
    }
    
    const messageElements = messageContainer.querySelectorAll('.Message .text-content');
    console.log('Найдено элементов сообщений:', messageElements.length);

    const recentMessages = [];
    messageElements.forEach(element => {
      const text = element.innerText.trim();
      if (text) {
        console.log('Найдено сообщение:', text);
        recentMessages.push({ content: text });
      }
    });

    if (recentMessages.length === 0) {
      throw new MessagesAnalysisError('Не удалось найти сообщения.');
    }

    return recentMessages;
  } catch (error) {
    console.error('Ошибка при получении сообщений:', error);
    throw new MessagesAnalysisError('Ошибка при анализе DOM.');
  }
}

async function generateNewMessage(analyzedMessages) {
  try {
    if (!Array.isArray(analyzedMessages)) {
      throw new Error('Ошибка: анализированные сообщения должны быть массивом');
    }

    const apiKey = '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';

    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    const requestData = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Сгенерируй мне оригинальное сообщение, тема которого я отправила тебе, на 2-3 предложения: "
        },
        ...analyzedMessages.map(msg => ({
          role: "user",
          content: msg.content
        }))
      ]
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error('Ошибка API: ' + response.status);
    }

    const result = await response.json();
    const generatedText = result.choices[0].message.content;

    return generatedText;
  } catch (error) {
    console.error('Ошибка API запроса: ', error);
    throw error;
  }
}

async function handleButtonClick() {
  try {
    updateStatus("Анализ сообщений...");

    let analyzedMessages;

    try {
      analyzedMessages = getChatMessages();
      console.log("Анализированные сообщения:", analyzedMessages);
    } catch (error) {
      if (error instanceof MessagesAnalysisError) {
        updateStatus("Ошибка анализа сообщений");
        return;
      } else {
        throw error;
      }
    }

    updateStatus("Генерация текста...");

    if (analyzedMessages.length > 0) {
      const generatedText = await generateNewMessage(analyzedMessages);
      updateGeneratedText(generatedText);
    } else {
      const generatedText = await generateNewMessage([]);
      updateGeneratedText(generatedText);
    }

    updateStatus("Генерация завершена");
  } catch (error) {
    console.warn("Неожиданная ошибка: ", error);
    updateStatus("Неожиданная ошибка при генерации текста");
  }
}

document.querySelectorAll('.generateButton').forEach(button => {
  button.addEventListener("click", handleButtonClick);
});

function updateStatus(message) {
  const statusElement = document.getElementById('status');
  if (statusElement) {
    statusElement.textContent = message;
  }
}

function updateGeneratedText(generatedText) {
  const responseElement = document.getElementById('response');
  if (responseElement) {
    responseElement.textContent = generatedText;
  } else {
    console.error("Элемент 'response' не был найден");
    updateStatus("Элемент 'response' не был найден");
  }
}
