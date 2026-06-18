document.addEventListener("DOMContentLoaded", () => {
  const chatFab = document.getElementById("chat-fab");
  const chatWindow = document.getElementById("chat-window");
  const closeChat = document.getElementById("close-chat");
  const sendChat = document.getElementById("send-chat");
  const chatInput = document.getElementById("chat-input");
  const chatBody = document.getElementById("chat-body");

  // Toggle Chat Window
  chatFab.addEventListener("click", () => {
    chatWindow.classList.toggle("d-none");
    if (!chatWindow.classList.contains("d-none")) {
      chatInput.focus();
    }
  });

  closeChat.addEventListener("click", () => {
    chatWindow.classList.add("d-none");
  });

  function addMessage(text, isAI) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `chat-message ${isAI ? "ai-message" : "user-message"}`;
    msgDiv.innerText = text;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  async function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;

    // Add user message to UI
    addMessage(text, false);
    chatInput.value = "";

    // Show typing indicator
    const typingIndicator = document.createElement("div");
    typingIndicator.className = "chat-message ai-message typing-indicator";
    typingIndicator.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    chatBody.appendChild(typingIndicator);
    chatBody.scrollTop = chatBody.scrollHeight;

    // Simulate chatbot response locally
    setTimeout(() => {
      if (chatBody.contains(typingIndicator)) {
        chatBody.removeChild(typingIndicator);
      }

      // Generate a mock response helper or generic support guide
      let responseText = "Thank you for reaching out! I am the Vinea Care offline assistant. For professional care inquiries, careers, or urgent assistance, please contact us directly at admin@vineacare.com or +44 7366 313213. We'll be happy to help!";
      
      const lowerText = text.toLowerCase();
      if (lowerText.includes("job") || lowerText.includes("career") || lowerText.includes("apply") || lowerText.includes("work")) {
        responseText = "If you're interested in joining our caregiving team, please download our application form using the button in the 'Become a Caregiver' section and send it to careers@vineacare.com.";
      } else if (lowerText.includes("service") || lowerText.includes("live-in") || lowerText.includes("palliative") || lowerText.includes("respite") || lowerText.includes("visiting")) {
        responseText = "We provide Live-in Care, Palliative Care, Respite Care, and Visiting Care. Please let us know if you'd like us to arrange a call to discuss a tailored care plan, or dial us at +44 7366 313213.";
      } else if (lowerText.includes("hello") || lowerText.includes("hi ") || lowerText.includes("hey")) {
        responseText = "Hello! Welcome to Vinea Care support. How can I guide you today? (You can ask about our care services, job opportunities, or how to contact us).";
      }

      addMessage(responseText, true);
    }, 800);
  }

  sendChat.addEventListener("click", handleSend);

  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  });
});
