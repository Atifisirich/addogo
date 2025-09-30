// Chatbot UI Elements
const chatbotContainer = document.createElement('div');
chatbotContainer.id = 'website-chatbot';
chatbotContainer.className = 'fixed bottom-6 right-6 z-[100]';

// Chatbot Toggle Button
const toggleButton = document.createElement('button');
toggleButton.id = 'chatbot-toggle';
toggleButton.className = 'w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 focus:outline-none ring-4 ring-blue-500/20';
toggleButton.innerHTML = '<i data-lucide="message-circle" class="w-7 h-7"></i>';

// Chatbot Window
const chatWindow = document.createElement('div');
chatWindow.id = 'chat-window';
chatWindow.className = 'hidden fixed bottom-24 right-6 w-80 h-[500px] bg-white rounded-t-2xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden';

// Chat Header
const chatHeader = document.createElement('div');
chatHeader.className = 'bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center';
chatHeader.innerHTML = `
  <div class="flex items-center space-x-2">
    <div class="w-8 h-8 bg-white rounded-full flex items-center justify-center">
      <i data-lucide="bot" class="w-5 h-5 text-blue-600"></i>
    </div>
    <h3 class="font-semibold">Addogo Assistant</h3>
  </div>
  <button id="close-chat" class="text-white hover:text-gray-200">
    <i data-lucide="x" class="w-5 h-5"></i>
  </button>
`;

// Chat Messages Area
const chatMessages = document.createElement('div');
chatMessages.id = 'chat-messages';
chatMessages.className = 'flex-1 p-4 overflow-y-auto';

// Welcome Message
const welcomeMessage = document.createElement('div');
welcomeMessage.className = 'mb-4';
welcomeMessage.innerHTML = `
  <div class="bg-blue-50 text-gray-800 p-3 rounded-lg max-w-[85%] inline-block">
    <p class="font-medium text-blue-700">👋 Hello! I'm Addogo's AI assistant.</p>
    <p class="text-sm mt-1">How can I help you with your digital marketing needs today?</p>
    <div class="mt-2 space-y-1">
      <button class="quick-question" data-question="Website development cost?">💻 Website Development</button><br>
      <button class="quick-question" data-question="SEO services pricing?">🔍 SEO Services</button><br>
      <button class="quick-question" data-question="Social media packages?">📱 Social Media</button>
    </div>
  </div>
`;

// Chat Input Area
const chatInputArea = document.createElement('div');
chatInputArea.className = 'p-3 border-t border-gray-200 bg-gray-50';
chatInputArea.innerHTML = `
  <div class="relative">
    <input type="text" id="user-input" 
           class="w-full p-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" 
           placeholder="Type your message...">
    <button id="send-message" class="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700">
      <i data-lucide="send" class="w-5 h-5"></i>
    </button>
  </div>
`;

// Assemble the chat window
chatWindow.appendChild(chatHeader);
chatMessages.appendChild(welcomeMessage);
chatWindow.appendChild(chatMessages);
chatWindow.appendChild(chatInputArea);
chatbotContainer.appendChild(toggleButton);
chatbotContainer.appendChild(chatWindow);

document.body.appendChild(chatbotContainer);

// Initialize Lucide Icons
if (window.lucide) {
  lucide.createIcons();
}

// Chatbot Functionality
document.addEventListener('DOMContentLoaded', function() {
  const toggleButton = document.getElementById('chatbot-toggle');
  const chatWindow = document.getElementById('chat-window');
  const closeButton = document.getElementById('close-chat');
  const sendButton = document.getElementById('send-message');
  const userInput = document.getElementById('user-input');
  const chatMessages = document.getElementById('chat-messages');

  // Toggle chat window
  toggleButton.addEventListener('click', function() {
    chatWindow.classList.toggle('hidden');
    if (!chatWindow.classList.contains('hidden')) {
      userInput.focus();
    }
  });

  // Close chat window
  closeButton.addEventListener('click', function() {
    chatWindow.classList.add('hidden');
  });

  // Handle quick question buttons
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('quick-question')) {
      const question = e.target.getAttribute('data-question');
      userInput.value = question;
      sendMessage();
    }
  });

  // Send message on button click
  sendButton.addEventListener('click', sendMessage);

  // Send message on Enter key
  userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;

    // Add user message to chat
    addMessage(message, 'user');
    userInput.value = '';

    // Get and display bot response
    setTimeout(() => {
      const response = getBotResponse(message);
      addMessage(response, 'bot');
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 500);
  }

  function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `mb-4 ${sender === 'user' ? 'text-right' : ''}`;
    
    const messageBubble = document.createElement('div');
    messageBubble.className = sender === 'user' 
      ? 'bg-blue-600 text-white p-3 rounded-lg inline-block max-w-[85%] text-left' 
      : 'bg-gray-100 text-gray-800 p-3 rounded-lg inline-block max-w-[85%]';
    
    // Convert line breaks to <br> tags for bot messages
    const formattedText = sender === 'bot' 
      ? text.replace(/\n/g, '<br>') 
      : text;
    
    messageBubble.innerHTML = formattedText;
    messageDiv.appendChild(messageBubble);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function getBotResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Common greetings
    if (/(hi|hello|hey|greetings|good\s*(morning|afternoon|evening))/i.test(lowerMessage)) {
      const greetings = [
        "Hello! I'm Addogo's AI assistant. How can I help you with your digital marketing needs today?",
        "Hi there! Welcome to Addogo. What can I help you with today?",
        "Hello! Thanks for reaching out. How can I assist you with your digital marketing?"
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    // Website development
    if (/(website|web design|web development|create a site|build a website)/i.test(lowerMessage)) {
      const responses = [
        "We'd love to help you with your website needs! Our team creates custom, mobile-responsive, and SEO-friendly websites tailored to your business. Could you share your contact details so our team can get in touch with a personalized quote?",
        "Thanks for your interest in our website development services! We offer custom solutions to match your specific requirements. Please share your contact information, and our team will reach out to discuss your project in detail.",
        "We specialize in building professional websites that drive results. To provide you with the best solution, we'd like to understand your needs better. Could you share your contact details so we can schedule a consultation?"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // SEO services
    if (/(seo|search engine optimization|rank higher|google ranking|organic traffic)/i.test(lowerMessage)) {
      const responses = [
        "We'd be happy to assist with your SEO needs! Our comprehensive optimization services include keyword research, on-page SEO, and performance tracking. Could you share your contact details so we can discuss how we can help improve your search rankings?",
        "Thanks for your interest in our SEO services! We provide tailored solutions to boost your online visibility. Please share your contact information, and our team will reach out to discuss a strategy that works for your business.",
        "We help businesses improve their search engine rankings through proven SEO strategies. To better understand your needs, could you share your contact details? We'll arrange a consultation to discuss how we can enhance your online presence."
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Social media
    if (/(social media|facebook|instagram|linkedin|posting|content creation)/i.test(lowerMessage)) {
      const responses = [
        "We'd love to help you enhance your social media presence! Our team handles content creation, posting, and engagement across all major platforms. Could you share your contact details so we can discuss a strategy that fits your business?",
        "Thanks for your interest in our social media services! We create customized strategies to grow your online presence. Please share your contact information, and we'll connect you with one of our social media experts.",
        "We specialize in developing effective social media strategies tailored to your business goals. To better assist you, could you share your contact details? Our team will reach out to discuss how we can elevate your social media presence."
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // WhatsApp automation
    if (/(whatsapp|automation|chatbot|auto reply|business api)/i.test(lowerMessage)) {
      const responses = [
        "We can help you set up WhatsApp Business automation to streamline your customer communications! Our solutions include automated responses, notifications, and more. Could you share your contact details so we can discuss how we can help automate your WhatsApp business?",
        "Thanks for your interest in our WhatsApp automation services! We create customized solutions to enhance your customer engagement. Please share your contact information, and our team will reach out to discuss the best approach for your business.",
        "We specialize in implementing WhatsApp Business automation to help you engage with customers 24/7. To better understand your requirements, could you share your contact details? We'll arrange a consultation to explore how automation can benefit your business."
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Pricing
    if (/(price|cost|how much|pricing|package|plan)/i.test(lowerMessage)) {
      const responses = [
        "We understand that pricing is an important consideration. Our services are tailored to each client's specific needs, so we provide personalized quotes after understanding your requirements. Could you share your contact details so our team can prepare a customized proposal for you?",
        "Thank you for your interest in our services! We offer customized solutions with flexible pricing based on your specific needs. To provide you with the most accurate information, we'd love to learn more about your project. Could you share your contact details so we can schedule a consultation?",
        "We believe in transparent, value-based pricing that aligns with your business goals. Since every project is unique, we provide personalized quotes after understanding your requirements. Could you share your contact information? Our team will reach out to discuss the best options for your needs."
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Contact information
    if (/(contact|phone|number|email|address|location|where are you)/i.test(lowerMessage)) {
      const responses = [
        "📞 Call us: +91 6305655342\n📧 Email: addogo.com@addogo.com\n📍 Location: BN Reddy, Hyderabad 500070\n\nAvailable Mon-Sat, 9 AM - 6 PM IST. Want to schedule a call?",
        "Reach us at:\n\n• Phone/WhatsApp: +91 6305655342\n• Email: addogo.com@addogo.com\n• Address: BN Reddy, Hyderabad 500070\n\nWhen would be a good time to connect?"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Working hours
    if (/(hour|time|open|available|when are you open)/i.test(lowerMessage)) {
      const responses = [
        "⏰ Our hours:\n\n• Monday - Saturday: 9:00 AM - 6:00 PM IST\n• Sunday: Closed\n\nNeed to schedule outside these hours? Let us know!",
        "We're available:\n\n📅 Monday to Saturday\n🕘 9:00 AM - 6:00 PM IST\n\nClosed on Sundays and public holidays. Want to book an appointment?"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Fallback responses
    const fallbackResponses = [
      "I'm here to help with your digital marketing needs. Could you please rephrase your question or ask about our services like website development, SEO, social media, or WhatsApp automation?",
      "I want to make sure I understand your question correctly. Could you provide more details about what you're looking for?",
      "Thanks for your message! For more specific assistance, you might want to ask about our services like website development, SEO, social media management, or WhatsApp automation.",
      "I'm here to help! Could you let me know which of our services you're interested in? We offer website development, SEO, social media management, and WhatsApp automation solutions.",
      "I'd be happy to assist you! Could you tell me more about what you're trying to achieve with your digital marketing?"
    ];
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
});
