let generatedText;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "getRecentMessages") {
    const messages = getMessagesFromStorage();
    sendResponse({
      action: "gotRecentMessages",
      messages: messages,
    });
  } else if (request.action === "generateNewMessage") {
    generateMessage(request.conversation);
  } else if (request.action === "saveGeneratedMessage") {
    saveMessageToStorage(request.message);
  }
});

async function generateMessage(conversation) {
  try {
    const messages = request.conversation;

const generatedText = await generateTextFromMessages(messages);
    chrome.runtime.sendMessage({
      action: "generatedText",
      generatedText: generatedText,
      conversation: conversation,
    });
  } catch (error) {
    console.error('Error generating message:', error);
  }
}
