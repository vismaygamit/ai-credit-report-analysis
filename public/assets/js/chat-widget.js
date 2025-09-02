window.setName = function (name) {
  const el = document.getElementById("chat-user-name");
  if (el) {
    el.textContent = name;
  }
};

(function () {
  // Inject CSS
  const style = document.createElement("style");
  style.textContent = `
  /* Chat Widget Styles - Isolated and embeddable */
        .chat-widget {
            position: fixed;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        /* Chat Button */
        .chat-widget-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #1e3c72, #2a5298);
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(30, 60, 114, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: none;
            z-index: 999999;
        }

        .chat-widget-button:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 25px rgba(30, 60, 114, 0.5);
        }

        .chat-widget-button svg {
            width: 28px;
            height: 28px;
            fill: white;
            transition: transform 0.3s ease;
        }

        .chat-widget-button.active svg {
            transform: rotate(180deg);
        }

        /* Notification Badge */
        .chat-widget-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            width: 20px;
            height: 20px;
            background: #ff4757;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 600;
            color: white;
            border: 2px solid white;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }

        /* Chat Container */
        .chat-widget-container {
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 360px;
            height: 480px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
            transform: translateY(20px) scale(0.95);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 999998;
            overflow: hidden;
            border: 1px solid rgba(0, 0, 0, 0.08);
        }

        .chat-widget-container.active {
            transform: translateY(0) scale(1);
            opacity: 1;
            visibility: visible;
        }
        
        .chat-widget-container.maximized {
            /* full screen mode styles
            width: 100vw !important;
            height: 100vh !important; */
            /* halfscreen mode styles */
            width: 40vw !important;
            height: 90vh !important;
            bottom: 0 !important; 
            right: 0 !important; 
            /* left: 0 !important; make it left aligned */
            border-radius: 0 !important;
    }

        /* Chat Header */
        .chat-widget-header {
            background: linear-gradient(135deg, #1e3c72, #2a5298);
            color: white;
            padding: 20px;
            position: relative;
            border-radius: 16px 16px 0 0;
        }

        .chat-widget-header-content {
            display: flex;
            align-items: center;
        }

        .chat-widget-avatar {
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
        }

        .chat-widget-avatar svg {
            width: 22px;
            height: 22px;
            fill: white;
        }

        .chat-widget-info h3 {
            font-size: 1.1rem;
            font-weight: 600;
            margin: 0;
        }

        .chat-widget-info p {
            font-size: 0.85rem;
            opacity: 0.9;
            margin: 2px 0 0 0;
        }

        .chat-widget-close {
            position: absolute;
            top: 15px;
            right: 15px;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s ease;
        }

        .chat-widget-close:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        .chat-widget-close svg {
            width: 16px;
            height: 16px;
            fill: white;
        }

        .chat-widget-maximize {
            position: absolute;
            top: 15px;
            right: 50px;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s ease;
        }

        .chat-widget-maximize:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        .chat-widget-maximize svg {
            width: 16px;
            height: 16px;
            fill: white;
        }

        /* Online Status */
        .chat-widget-status {
            position: absolute;
            bottom: 18px;
            right: 20px;
            display: flex;
            align-items: center;
            font-size: 0.75rem;
            opacity: 0.9;
        }

        .chat-widget-status-dot {
            width: 8px;
            height: 8px;
            background: #4CAF50;
            border-radius: 50%;
            margin-right: 6px;
            animation: blink 2s infinite;
        }

        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.3; }
        }

        /* Chat Messages */
        .chat-widget-messages {
            height: 260px;
            overflow-y: auto;
            padding: 20px;
            background: #fafafa;
        }

        .chat-widget-message {
            margin-bottom: 15px;
            animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .chat-widget-message.bot {
            display: flex;
            align-items: flex-start;
        }

        .chat-widget-message.user {
            display: flex;
            justify-content: flex-end;
        }

        .chat-widget-message-content {
            max-width: 75%;
            padding: 12px 16px;
            border-radius: 18px;
            font-size: 0.9rem;
            line-height: 1.4;
            word-wrap: break-word;
        }

        .chat-widget-message.bot .chat-widget-message-content {
            background: white;
            color: #333;
            border-bottom-left-radius: 6px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
        }

        .chat-widget-message.user .chat-widget-message-content {
            background: linear-gradient(135deg, #1e3c72, #2a5298);
            color: white;
            border-bottom-right-radius: 6px;
        }

        .chat-widget-bot-avatar {
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #1e3c72, #2a5298);
            border-radius: 50%;
            margin-right: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .chat-widget-bot-avatar svg {
            width: 18px;
            height: 18px;
            fill: white;
        }

        /* Typing Indicator */
        .chat-widget-typing {
            display: none;
            align-items: center;
            padding: 15px 0;
        }

        .chat-widget-typing-dots {
            display: flex;
            align-items: center;
            margin-left: 42px;
        }

        .chat-widget-typing-dots span {
            height: 8px;
            width: 8px;
            background: #999;
            border-radius: 50%;
            display: inline-block;
            margin-right: 4px;
            animation: typing 1.4s infinite ease-in-out;
        }

        .chat-widget-typing-dots span:nth-child(1) { animation-delay: -0.32s; }
        .chat-widget-typing-dots span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes typing {
            0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
            40% { transform: scale(1); opacity: 1; }
        }

        /* Chat Input */
        .chat-widget-input {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 20px 20px 15px 20px;
            background: white;
            border-top: 1px solid #e1e8ed;
            border-radius: 0 0 16px 16px;
        }

        .chat-widget-input-container {
            display: flex;
            align-items: center;
            background: #f8f9fa;
            border-radius: 24px;
            padding: 8px 16px;
            border: 2px solid #e9ecef;
            transition: border-color 0.3s ease;
        }

        .chat-widget-input-container:focus-within {
            border-color: #1e3c72;
        }

        .chat-widget-message-input {
            flex: 1;
            border: none;
            outline: none;
            background: transparent;
            padding: 8px;
            font-size: 0.9rem;
            color: #333;
        }

        .chat-widget-message-input::placeholder {
            color: #999;
        }

        .chat-widget-send-button {
            width: 36px;
            height: 36px;
            background: linear-gradient(135deg, #1e3c72, #2a5298);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s ease;
            margin-left: 8px;
        }

        .chat-widget-send-button:hover {
            transform: scale(1.05);
        }

        .chat-widget-send-button svg {
            width: 18px;
            height: 18px;
            fill: white;
        }

        .chat-widget-powered-by {
            text-align: center;
            margin-top: 10px;
            font-size: 0.75rem;
            color: #999;
        }

        .chat-widget-powered-by strong {
            color: #1e3c72;
        }

        /* Scrollbar Styling */
        .chat-widget-messages::-webkit-scrollbar {
            width: 4px;
        }

        .chat-widget-messages::-webkit-scrollbar-track {
            background: transparent;
        }

        .chat-widget-messages::-webkit-scrollbar-thumb {
            background: #ddd;
            border-radius: 4px;
        }

        /* Mobile Responsive */
        @media (max-width: 480px) {
            .chat-widget-container {
                width: calc(100vw - 20px);
                height: calc(100vh - 120px);
                right: 10px;
                left: 10px;
                bottom: 90px;
                max-height: 600px;
            }
            
            .chat-widget-button {
                bottom: 15px;
                right: 15px;
            }

            .chat-widget-messages {
                height: calc(100% - 160px);
            }
        }

        /* Demo page styles - remove these when embedding */
        .demo-page {
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            text-align: center;
            padding: 20px;
        }

        .demo-content h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            opacity: 0.9;
        }

        .demo-content p {
            font-size: 1.2rem;
            opacity: 0.8;
            max-width: 600px;
        }
            /* Mobile (up to 480px) */
@media (max-width: 480px) {
  .chat-widget-container {
    width: 100vw !important;
    height: 100vh !important;
    bottom: 0 !important;
    right: 0 !important;
    left: 0 !important;
    border-radius: 0 !important;
  }
  .chat-widget-button {
    bottom: 15px;
    right: 15px;
  }
  .chat-widget-messages {
    height: calc(100% - 160px);
  }
}

    /* Tablet (481px to 768px) */
    @media (min-width: 481px) and (max-width: 768px) {
    .chat-widget-container {
        width: 50vw !important;
        height: 70vh !important;
        bottom: 10px !important;
        right: 10px !important;
        border-radius: 12px !important;
    }
    }

    /* Small Laptops (769px to 1200px) */
    @media (min-width: 769px) and (max-width: 1200px) {
    .chat-widget-container.maximized {
        width: 50vw !important;
        height: 85vh !important;
        bottom: 0 !important;
        right: 0 !important;
        border-radius: 0 !important;
    }
    }

    /* Large Screens (1201px and above) */
    @media (min-width: 1201px) {
    .chat-widget-container.maximized {
        width: 40vw !important;
        height: 90vh !important;
        bottom: 0 !important;
        right: 0 !important;
        border-radius: 0 !important;
    }
    }
    <!--- message time -->
    .chat-widget-message-time {
        font-size: 0.75rem;
        opacity: 0.7;
        margin-top: 3px;
        display: block; 
    }

    .chat-widget-message.bot .chat-widget-message-time {
        color: #666;
        text-align: left;
        font-size: x-small !important;
        margin-top: 3px;
    }

    .chat-widget-message.user .chat-widget-message-time {
        color: rgba(255, 255, 255, 0.8);
        text-align: right;
        font-size: x-small !important;
        margin-top: 3px;
    }
  `;
  document.head.appendChild(style);

  // Inject HTML
  const widget = document.createElement("div");
  widget.innerHTML = `
    <!-- Chat Widget - Copy everything from here -->
    <div class="chat-widget">
        <!-- Chat Button -->
        <button class="chat-widget-button" id="chatWidgetButton">
          <!-- <div class="chat-widget-badge" id="chatWidgetBadge">1</div> -->
            <svg viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
            </svg>
        </button>

        <!-- Chat Container -->
        <div class="chat-widget-container" id="chatWidgetContainer">
            <div class="chat-widget-header">
               
            <button class="chat-widget-maximize" id="chatWidgetMaximize">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" id="maximize" class="icon glyph" fill="#ffffff" stroke="#ffffff">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M10.71,14.71,5.41,20H10a1,1,0,0,1,0,2H4a2,2,0,0,1-1.38-.56l0,0s0,0,0,0A2,2,0,0,1,2,20V14a1,1,0,0,1,2,0v4.59l5.29-5.3a1,1,0,0,1,1.42,1.42ZM21.44,2.62s0,0,0,0l0,0A2,2,0,0,0,20,2H14a1,1,0,0,0,0,2h4.59l-5.3,5.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L20,5.41V10a1,1,0,0,0,2,0V4A2,2,0,0,0,21.44,2.62Z" style="fill:#ffffff"></path></g>
                    </svg>
                </button>
                 <button class="chat-widget-close" id="chatWidgetClose">
                    <svg viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
                <div class="chat-widget-header-content">
                    <div class="chat-widget-avatar">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                    </div>
                    <div class="chat-widget-info">
                        <h3>Ai Assistant</h3>
                        <!-- <p>We typically reply instantly</p> -->
                    </div>
                </div>
                <div class="chat-widget-status">
                    <div class="chat-widget-status-dot"></div>
                    Online
                </div>
            </div>

            <div class="chat-widget-messages" id="chatWidgetMessages">
                <div class="chat-widget-message bot">
                    <div class="chat-widget-bot-avatar">
                        <svg viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <div class="chat-widget-message-content">
                        👋 Hi <span id="chat-user-name"></span>, Welcome to our support chat. How can I help you today?
                        <div class="chat-widget-message-time">Just now</div>
                        </div>
                </div>
            </div>

            <div class="chat-widget-typing" id="chatWidgetTyping">
                <div class="chat-widget-typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>

            <div class="chat-widget-input">
                <div class="chat-widget-input-container">
                    <input type="text" class="chat-widget-message-input" id="chatWidgetMessageInput" placeholder="Type your message...">
                    <button class="chat-widget-send-button" id="chatWidgetSendButton">
                        <svg viewBox="0 0 24 24">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                    </button>
                </div>
                <!-- <div class="chat-widget-powered-by">
                    Powered by <strong>TechSolutions</strong>
                </div> -->
            </div>
        </div>
    </div>
    <!-- End Chat Widget -->
  `;
  document.body.appendChild(widget);

  // ChatWidget Logic
  class ChatWidget {
    constructor() {
      this.button = document.getElementById("chatWidgetButton");
      this.container = document.getElementById("chatWidgetContainer");
      this.closeButton = document.getElementById("chatWidgetClose");
      this.maximizeButton = document.getElementById("chatWidgetMaximize");
      this.messageInput = document.getElementById("chatWidgetMessageInput");
      this.input = document.getElementById("chatWidgetMessageInput");
      this.sendButton = document.getElementById("chatWidgetSendButton");
      this.messages = document.getElementById("chatWidgetMessages");
      this.typing = document.getElementById("chatWidgetTyping");
      this.badge = document.getElementById("chatWidgetBadge");
      this.isOpen = false;
      this.isMaximized = false;

      //   this.botResponses = [
      //     "Thanks for reaching out! Our team will assist you shortly. 😊",
      //     "I understand your concern. Let me connect you with the right specialist.",
      //     "Great question! Here's what I can tell you about that...",
      //     "I'm here to help! Could you provide a bit more detail about your issue?",
      //     "That's a common request. Let me get that information for you.",
      //     "I appreciate your patience. Our team is reviewing your inquiry.",
      //     "Absolutely! I'd be happy to help you resolve this.",
      //     "Thank you for contacting us. Is there anything else I can assist with?",
      //   ];
      this.init();
    }

    init() {
      // Load socket.io client from CDN
      const script = document.createElement("script");
      script.src = "https://cdn.socket.io/4.8.1/socket.io.min.js";
      const token = localStorage.getItem("token");
      script.onload = () => {
        this.socket = io("https://ai-credit-report-analysis.vercel.app", { auth: { token } }); // ⬅️ your backend URL
        // Listen for messages from server
        this.socket.on("message", (msg) => {
          const messageDiv = document.createElement("div");
          messageDiv.className = `chat-widget-message bot`;
          const currentTime = this.getCurrentTime();
          messageDiv.innerHTML = `
                        <div class="chat-widget-bot-avatar">
                            <svg viewBox="0 0 24 24">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <div class="chat-widget-message-content">
                        ${msg}
                        <div class="chat-widget-message-time">${currentTime}</div>
                        </div>
                        
                    `;
          this.hideTyping();
          this.messages.appendChild(messageDiv);
          this.scrollToBottom();
        });
        // Optional: listen for typing events
        this.socket.on("typing", () => {
          this.showTyping();
          setTimeout(() => this.hideTyping(), 1500);
        });
      };
      document.head.appendChild(script);

      this.button.addEventListener("click", () => this.toggleChat());
      this.closeButton.addEventListener("click", () => this.closeChat());
      this.sendButton.addEventListener("click", () => this.sendMessage());
      this.maximizeButton.addEventListener("click", () =>
        this.toggleMaximize()
      );
      this.messageInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.sendMessage();
        }
      });
      // Close chat when clicking outside (optional)
      document.addEventListener("click", (e) => {
        if (
          this.isOpen &&
          !this.container.contains(e.target) &&
          !this.button.contains(e.target)
        ) {
          // Uncomment the line below if you want click-outside-to-close behavior
          //   this.closeChat();
        }
      });

      // Show initial notification badge
    //   setTimeout(() => this.showNotification(), 3000);
      if (window.innerWidth < 769) {
        this.maximizeButton.hidden = true;
      }
    }

    toggleChat() {
      if (this.isOpen) {
        this.closeChat();
      } else {
        this.openChat();
      }
    }

    openChat() {
      this.isOpen = true;
      this.container.classList.add("active");
      this.button.classList.add("active");
      this.messageInput.focus();
    //   this.hideNotification();
      if (window.innerWidth < 769) {
        this.button.hidden = true;
      }
    }

    closeChat() {
      this.isOpen = false;
      this.container.classList.remove("active");
      this.button.classList.remove("active");
      this.button.hidden = false;
    }

    sendMessage() {
      const message = this.messageInput.value.trim();
      if (!message) return;

      this.addMessage(message, "user");
      this.messageInput.value = "";

      // Show typing indicator and simulate bot response
      //   setTimeout(() => this.showTyping(), 500);
      //   setTimeout(() => this.addBotResponse(), Math.random() * 2000 + 1500);
    }

    addMessage(text, sender) {
      const messageDiv = document.createElement("div");
      messageDiv.className = `chat-widget-message ${sender}`;
      const currentTime = this.getCurrentTime();
      //   if (sender === "bot") {
      //     messageDiv.innerHTML = `
      //                     <div class="chat-widget-bot-avatar">
      //                         <svg viewBox="0 0 24 24">
      //                             <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      //                         </svg>
      //                     </div>
      //                     <div class="chat-widget-message-content">
      //                     ${text}
      //                     <div class="chat-widget-message-time">${currentTime}</div>
      //                     </div>

      //                 `;
      //   } else {
      messageDiv.innerHTML = `<div class="chat-widget-message-content">${text}<div class="chat-widget-message-time">${currentTime}</div></div>`;
      this.socket.emit("message", text);
      // }
      this.messages.appendChild(messageDiv);
      this.showTyping();
      this.scrollToBottom();
    }

    showTyping() {
      this.messageInput.disabled = true;
      this.sendButton.disabled = true;
      this.typing.style.display = "flex";
      this.scrollToBottom();
    }

    hideTyping() {
      this.messageInput.disabled = false;
      this.sendButton.disabled = false;
      this.typing.style.display = "none";
    }

    addBotResponse() {
      this.hideTyping();
      //   const randomResponse =
      //     this.botResponses[Math.floor(Math.random() * this.botResponses.length)];
      //   this.addMessage(randomResponse, "bot");
    }

    showNotification() {
      if (!this.isOpen) {
        this.badge.style.display = "flex";
      }
    }

    hideNotification() {
      this.badge.style.display = "none";
    }
    getCurrentTime() {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 should be 12
      return `${hours}:${minutes} ${ampm}`;
    }

    scrollToBottom() {
      this.messages.scrollTop = this.messages.scrollHeight;
    }

    toggleMaximize() {
      this.isMaximized = !this.isMaximized;
      if (window.innerWidth > 480) {
        this.container.classList.toggle("maximized", this.isMaximized);
        this.messages.style.height = "625px";
        this.maximizeButton.hidden = false;
      }
      if (!this.isMaximized) {
        this.messages.style.height = "260px";
        // this.messageTime.style.marginTop = "70px";
      } else {
        // this.messageTime.style.marginTop = "32px";
      }
    }
  }

  new ChatWidget();
})();
