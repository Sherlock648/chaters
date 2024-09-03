function getRecentMessages() {
  const messages = [];
  const messageElements = document.querySelectorAll('.im-mess');
  const reversedMessages = Array.from(messageElements).reverse().slice(0, 10);

  reversedMessages.forEach(element => {
    const messageInfo = extractMessageInfo(element);
    messages.push(messageInfo);
  });

  console.log('Recent Messages:', messages);
  return messages;
}

function extractMessageInfo(messageElement) {
  const text = messageElement.querySelector('.im-mess--text').textContent.trim();
  const cmid = messageElement.getAttribute('data-cmid');
  return { text, cmid };
}

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
      this.pageSource = request.source;
      var title = this.pageSource.match(/<title[^>]*>([^<]+)<\/title>/)[1];
      alert(title)
  }
});

chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  chrome.tabs.executeScript(
      tabs[0].id,
      { code: 'var s = document.documentElement.outerHTML; chrome.runtime.sendMessage({action: "getSource", source: s});' }
  );
});
