// Scripts moved from temporary.html
// ... All JS from <script> in temporary.html will be placed here ...
// Localization logic
const localeMap = {
  'be': null, // Belarusian (default, from HTML)
  'en': 'assets/locales/en.json',
  'es': 'assets/locales/es.json',
  'fr': 'assets/locales/fr.json',
  'ru': 'assets/locales/ru.json'
};
let currentLocale = localStorage.getItem('locale') || 'be';
let translations = {};

function setLocale(locale) {
  currentLocale = locale;
  localStorage.setItem('locale', locale);
  if (locale === 'be') {
    translations = {};
    applyTranslations();
    return;
  }
  fetch(localeMap[locale])
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load locale: ${locale}`);
        return res.json();
      })
      .then(json => {
        translations = json;
        applyTranslations();
      })
      .catch(error => {
        console.error('Error loading locale:', error);
        // Fallback to Belarusian if loading fails
        currentLocale = 'be';
        translations = {};
        applyTranslations();
      });

      window.location.reload();
}

function t(key, fallback) {
  return translations[key] || fallback || key;
}

function applyTranslations() {
  // Sidebar
    const newChatBtn = document.querySelector('#new-chat-btn span');
    if (newChatBtn) newChatBtn.textContent = t('new_chat', 'Новы чат');
    const mainPageBtn = document.querySelector('#main-page-btn span');
    if (mainPageBtn) mainPageBtn.textContent = t('main_page', 'Галоўная');
    const sidebarTitles = document.querySelectorAll('.sidebar-title');
    if (sidebarTitles[0]) sidebarTitles[0].textContent = t('tools', 'Інструменты');
    if (sidebarTitles[1]) sidebarTitles[1].textContent = t('chat_history', 'Гісторыя чатаў');
    const imageGenBtn = document.querySelector('.sidebar-item[data-mode="image"] span');
    if (imageGenBtn) imageGenBtn.textContent = t('image_generation', 'Генерацыя выяў');
    const settingsBtnSpan = document.querySelector('#settings-btn span');
    if (settingsBtnSpan) settingsBtnSpan.textContent = t('settings', 'Налады');
    const helpBtn = document.querySelector('.sidebar-item i.fa-info-circle + span');
    if (helpBtn) helpBtn.textContent = t('help', 'Даведка');

    // Settings modal
    const settingsTitle = document.querySelector('.settings-title');
    if (settingsTitle) settingsTitle.textContent = t('settings_title', 'Налады');
    const interfaceThemeLabel = document.querySelector('.settings-section label:first-of-type');
    if (interfaceThemeLabel) interfaceThemeLabel.textContent = t('interface_theme', 'Тэма інтэрфейсу:');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    if (clearHistoryBtn) clearHistoryBtn.textContent = t('clear_history', 'Ачысціць гісторыю чатаў');
    const aboutBtn = document.getElementById('about-btn');
    if (aboutBtn) aboutBtn.textContent = t('about', 'Пра праграму');
    const settingsAbout = document.querySelector('.settings-about');
    if (settingsAbout) settingsAbout.innerHTML = t('about_text', 'AIST Чат-Бот<br>Версія: 1.0<br>AI, генерацыя выяў, шмат тэм.');
    const languageLabel = document.querySelector('.settings-section label[for="language-select"]');
    if (languageLabel) languageLabel.textContent = t('language_label', 'Мова:');

    // Theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
      const theme = btn.dataset.theme;
      btn.textContent = t(`theme_${theme}`, theme.charAt(0).toUpperCase() + theme.slice(1));
    });

    // Main content
    const searchScreenP = document.querySelector('#search-screen p');
    if (searchScreenP) searchScreenP.textContent = t('ask_question', 'Задайце пытанне або пачніце новы дыялог');
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.placeholder = t('input_placeholder', 'Напішыце ваша пытанне...');
    const chatTitle = document.querySelector('.chat-title');
    if (chatTitle) chatTitle.textContent = t('chat_title', 'AIST');
    const chatInput = document.getElementById('chat-input');
    if (chatInput) chatInput.placeholder = t('chat_input_placeholder', 'Напішыце паведамленне...');
    const imageGenTitle = document.querySelector('#image-gen-screen h1');
    if (imageGenTitle) imageGenTitle.textContent = t('image_gen_title', 'Генерацыя выяў');
    const imageGenDesc = document.querySelector('#image-gen-screen p');
    if (imageGenDesc) imageGenDesc.textContent = t('image_gen_desc', 'Апішыце што вы хочаце ўбачыць і AIST стварыць унікальныя выявы');
    const imageGenInput = document.getElementById('image-gen-input');
    if (imageGenInput) imageGenInput.placeholder = t('image_gen_input_placeholder', "Напрыклад: 'Котка ў касмічным скафандры'");

    // Buttons
    const sendButton = document.getElementById('send-button');
    if (sendButton) sendButton.title = t('send', 'Адправіць');
    const searchButton = document.getElementById('search-button');
    if (searchButton) searchButton.title = t('send', 'Адправіць');
    const imageGenButton = document.getElementById('image-gen-button');
    if (imageGenButton) imageGenButton.title = t('generate', 'Згенераваць');
    const attachButton = document.getElementById('attach-button');
    if (attachButton) attachButton.title = t('attach', 'Прымацаваць');
  }

document.addEventListener('DOMContentLoaded', () => {
  currentLocale = localStorage.getItem('locale') || 'be';

   if (currentLocale !== 'be') {
      fetch(localeMap[currentLocale])
        .then(res => res.json())
        .then(json => {
          translations = json;
          applyTranslations();
        })
        .catch(() => {
          console.error('Failed to load locale, falling back to Belarusian');
          currentLocale = 'be';
          translations = {};
          applyTranslations();
        });
    }

  // App initialization
  initApp();
  handleMobileView();

  // DCGAN initialization
  if (typeof ml5 !== 'undefined') {
    dcgan = ml5.DCGAN('face', () => {
      dcganLoaded = true;
      enableImageGenButton();
    });
  }
});

// Settings modal logic
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeSettings = document.getElementById('close-settings');
settingsBtn.addEventListener('click', () => { settingsModal.style.display = 'flex'; });
closeSettings.addEventListener('click', () => { settingsModal.style.display = 'none'; });
settingsModal.addEventListener('click', (e) => { if (e.target === settingsModal) settingsModal.style.display = 'none'; });
// Theme switching
const themeBtns = document.querySelectorAll('.theme-btn');
themeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    setTheme(btn.getAttribute('data-theme'));
  });
});
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}
// Глобальные переменные
    let currentChatId = null;
    let chats = {};
    let currentMode = 'chat';
    let dcgan = null;
    let dcganLoaded = false;
    let dcganCanvas = null;

    // Инициализация при загрузке
    // (Removed duplicate DOMContentLoaded block)

    // Инициализация приложения
    function initApp() {
      // Загрузка сохраненных данных
      loadSavedData();

      // Инициализация элементов интерфейса
      initUIElements();

      // Загрузка истории чатов
      loadChatHistory();

      // Установка начального режима
      switchMode('chat');
    }

    // Загрузка сохраненных данных
    function loadSavedData() {
      // Загрузка темы
      const savedTheme = localStorage.getItem('theme') || 'light';
      document.documentElement.setAttribute('data-theme', savedTheme);

      // Загрузка состояния бокового меню
      const isSidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
      if (isSidebarCollapsed) {
        document.getElementById('sidebar').classList.add('collapsed');
      }

      // Загрузка чатов
      try {
        const savedChats = localStorage.getItem('chats');
        chats = savedChats ? JSON.parse(savedChats) : {};
      } catch (e) {
        console.error('Error loading chats:', e);
        chats = {};
      }
    }

    // Инициализация элементов интерфейса
    function initUIElements() {
      // Боковое меню
      const sidebar = document.getElementById('sidebar');
      const sidebarToggle = document.getElementById('sidebar-toggle');

      sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
      });

      // Кнопка нового чата
      document.getElementById('new-chat-btn').addEventListener('click', createNewChat);

      // Переключение темы
      document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

      // Настройки
      const settingsBtn = document.getElementById('settings-btn');
      const settingsModal = document.getElementById('settings-modal');
      const closeSettings = document.getElementById('close-settings');

      if (settingsBtn && settingsModal && closeSettings) {
        settingsBtn.addEventListener('click', () => { settingsModal.style.display = 'flex'; });
        closeSettings.addEventListener('click', () => { settingsModal.style.display = 'none'; });
        settingsModal.addEventListener('click', (e) => {
          if (e.target === settingsModal) settingsModal.style.display = 'none';
        });

        // Выбор темы
        document.querySelectorAll('.theme-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            setTheme(btn.getAttribute('data-theme'));
          });
        });

        // Очистка истории
        document.getElementById('clear-history-btn').addEventListener('click', clearChatHistory);

        // О программе
        document.getElementById('about-btn').addEventListener('click', showAbout);
      }

      // Поиск и чат
      document.getElementById('search-button').addEventListener('click', startChat);
      document.getElementById('search-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') startChat();
      });

      document.getElementById('send-button').addEventListener('click', sendMessage);
      document.getElementById('chat-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendMessage();
      });

      // Генерация изображений
      document.getElementById('image-gen-button').addEventListener('click', generateImage);
      document.getElementById('image-gen-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') generateImage();
      });

      // Переключение режимов
      document.querySelectorAll('.sidebar-item[data-mode]').forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          switchMode(item.dataset.mode);
        });
      });
    }

    // Переключение темы
    function toggleTheme() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    }



    // Создание нового чата
    function createNewChat() {
      const chatId = 'chat-' + Date.now();
      currentChatId = chatId;

      chats[chatId] = {
        id: chatId,
        title: 'Новы чат ' + (Object.keys(chats).length + 1),
        messages: [],
        createdAt: new Date().toISOString()
      };

      saveChats();
      updateChatHistoryUI();

      // Очистка интерфейса
      document.getElementById('chat-messages').innerHTML = '';
      document.getElementById('chat-container').classList.remove('active');
      document.getElementById('search-screen').style.display = 'flex';
      document.getElementById('image-gen-screen').style.display = 'none';

      // Очистка полей ввода
      document.getElementById('search-input').value = '';
      document.getElementById('chat-input').value = '';

      // Установка режима чата
      currentMode = 'chat';
      updateActiveChatInHistory();
    }

    // Загрузка чата
    function loadChat(chatId) {
      if (!chats[chatId]) return;

      currentChatId = chatId;
      const chat = chats[chatId];

      const chatMessages = document.getElementById('chat-messages');
      chatMessages.innerHTML = '';

      if (!chat.messages || chat.messages.length === 0) {
        document.getElementById('search-screen').style.display = 'flex';
        document.getElementById('chat-container').classList.remove('active');
        return;
      }

      chat.messages.forEach(msg => {
        addMessage(msg.text, msg.isUser, false);
      });

      document.getElementById('chat-container').classList.add('active');
      document.getElementById('search-screen').style.display = 'none';
      document.getElementById('image-gen-screen').style.display = 'none';

      updateActiveChatInHistory();
      currentMode = 'chat';
    }

    // Сохранение сообщения
    function saveMessage(text, isUser) {
      if (!currentChatId || !chats[currentChatId]) return;

      chats[currentChatId].messages.push({
        text,
        isUser,
        timestamp: new Date().toISOString()
      });

      // Обновление заголовка чата
      if (chats[currentChatId].messages.length === 1 && isUser) {
        chats[currentChatId].title = text.length > 30 ? text.substring(0, 30) + '...' : text;
      }

      saveChats();
      updateChatHistoryUI();
    }

    // Загрузка истории чатов
    function loadChatHistory() {
      updateChatHistoryUI();
    }

    // Обновление UI истории чатов
    function updateChatHistoryUI() {
      const sidebarHistory = document.querySelector('.sidebar-section.chat-history-section');
      if (!sidebarHistory) return;

      // Очистка текущей истории (кроме заголовков)
      const historyItems = sidebarHistory.querySelectorAll('.sidebar-item[data-chat-id]');
      historyItems.forEach(item => item.remove());

      // Сортировка чатов по дате
      const sortedChats = Object.values(chats).sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt));

      // Добавление чатов в историю
      sortedChats.forEach(chat => {
        const chatItem = document.createElement('div');
        chatItem.className = `sidebar-item ${chat.id === currentChatId ? 'active' : ''}`;
        chatItem.dataset.chatId = chat.id;
        chatItem.style.display = 'flex';
        chatItem.style.alignItems = 'center';
        chatItem.style.justifyContent = 'space-between';

        // Левая часть (иконка и название)
        const leftDiv = document.createElement('div');
        leftDiv.style.display = 'flex';
        leftDiv.style.alignItems = 'center';
        leftDiv.style.gap = '8px';
        leftDiv.innerHTML = `
          <i class="fas fa-comment-dots"></i>
          <span>${chat.title}</span>
        `;
        leftDiv.style.flex = '1';
        leftDiv.style.cursor = 'pointer';
        leftDiv.addEventListener('click', (e) => {
          e.preventDefault();
          loadChat(chat.id);
          switchMode('chat');
        });

        // Правая часть (кнопка "...")
        const rightDiv = document.createElement('div');
        rightDiv.style.display = 'flex';
        rightDiv.style.alignItems = 'center';

        // Кнопка "..."
        const moreBtn = document.createElement('button');
        moreBtn.title = 'Опцыі';
        moreBtn.innerHTML = '<i class="fas fa-ellipsis-v"></i>';
        moreBtn.style.background = 'none';
        moreBtn.style.border = 'none';
        moreBtn.style.cursor = 'pointer';
        moreBtn.style.color = 'var(--text-light)';
        moreBtn.style.fontSize = '16px';
        moreBtn.style.padding = '0 4px';
        moreBtn.style.position = 'relative';

        // Дропдаун меню
        const dropdown = document.createElement('div');
        dropdown.className = 'chat-dropdown-menu';
        dropdown.style.display = 'none';
        dropdown.style.position = 'absolute';
        dropdown.style.right = '0';
        dropdown.style.top = '24px';
        dropdown.style.background = 'var(--card-bg)';
        dropdown.style.border = '1px solid var(--dark-bg)';
        dropdown.style.borderRadius = '8px';
        dropdown.style.boxShadow = 'var(--shadow-md)';
        dropdown.style.zIndex = '1000';
        dropdown.style.minWidth = '120px';
        dropdown.style.fontSize = '14px';
        dropdown.style.padding = '4px 0';

        // Опция: Rename
        const renameOpt = document.createElement('div');
        renameOpt.textContent = 'Перайменаваць';
        renameOpt.style.padding = '8px 16px';
        renameOpt.style.cursor = 'pointer';
        renameOpt.style.color = 'var(--text-dark)';
        renameOpt.addEventListener('mouseenter', () => renameOpt.style.background = 'var(--dark-bg)');
        renameOpt.addEventListener('mouseleave', () => renameOpt.style.background = '');
        renameOpt.addEventListener('click', (e) => {
          e.stopPropagation();
          dropdown.style.display = 'none';
          const newName = prompt('Новае імя чата:', chat.title);
          if (newName && newName.trim()) {
            chats[chat.id].title = newName.trim();
            saveChats();
            updateChatHistoryUI();
          }
        });

        // Опция: Delete
        const deleteOpt = document.createElement('div');
        deleteOpt.textContent = 'Выдаліць';
        deleteOpt.style.padding = '8px 16px';
        deleteOpt.style.cursor = 'pointer';
        deleteOpt.style.color = '#e57373';
        deleteOpt.addEventListener('mouseenter', () => deleteOpt.style.background = 'var(--dark-bg)');
        deleteOpt.addEventListener('mouseleave', () => deleteOpt.style.background = '');
        deleteOpt.addEventListener('click', (e) => {
          e.stopPropagation();
          dropdown.style.display = 'none';
          if (confirm('Вы сапраўды жадаеце выдаліць гэты чат?')) {
            delete chats[chat.id];
            if (currentChatId === chat.id) {
              currentChatId = null;
              document.getElementById('search-screen').style.display = 'flex';
              document.getElementById('chat-container').classList.remove('active');
            }
            saveChats();
            updateChatHistoryUI();
          }
        });

        dropdown.appendChild(renameOpt);
        dropdown.appendChild(deleteOpt);
        rightDiv.appendChild(moreBtn);
        rightDiv.appendChild(dropdown);

        // Показать/скрыть меню
        moreBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          document.querySelectorAll('.chat-dropdown-menu').forEach(menu => {
            if (menu !== dropdown) menu.style.display = 'none';
          });
          dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });

        // Скрыть меню при клике вне
        document.addEventListener('click', () => {
          dropdown.style.display = 'none';
        });

        chatItem.appendChild(leftDiv);
        chatItem.appendChild(rightDiv);
        sidebarHistory.appendChild(chatItem);
      });
    }

    // Обновление активного чата в истории
    function updateActiveChatInHistory() {
      document.querySelectorAll('.sidebar-item[data-chat-id]').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.chatId === currentChatId) {
          item.classList.add('active');
        }
      });
    }

    // Сохранение чатов
    function saveChats() {
      try {
        localStorage.setItem('chats', JSON.stringify(chats));
      } catch (e) {
        console.error('Error saving chats:', e);
      }
    }

    // Очистка истории чатов
    function clearChatHistory() {
      if (confirm('Вы сапраўды жадаеце ачысціць гісторыю чатаў?')) {
        localStorage.removeItem('chats');
        chats = {};
        currentChatId = null;
        document.getElementById('chat-messages').innerHTML = '';
        document.getElementById('chat-container').classList.remove('active');
        document.getElementById('search-screen').style.display = 'flex';
        updateChatHistoryUI();
      }
    }

    // Информация о программе
    function showAbout() {
      alert('AIST Чат-Бот\nВерсія: 1.0\nAI, генерацыя выяў, шмат тэм.');
    }

    // Переключение режимов
    function switchMode(mode) {
      currentMode = mode;

      // Обновление активных элементов в меню
      document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
      });

      const modeItem = document.querySelector(`.sidebar-item[data-mode="${mode}"]`);
      if (modeItem) modeItem.classList.add('active');

      // Переключение интерфейса
      if (mode === 'chat') {
        document.getElementById('image-gen-screen').style.display = 'none';

        if (!currentChatId || !chats[currentChatId] || !chats[currentChatId].messages.length) {
          document.getElementById('search-screen').style.display = 'flex';
          document.getElementById('chat-container').classList.remove('active');
        } else {
          document.getElementById('chat-container').classList.add('active');
          document.getElementById('search-screen').style.display = 'none';
        }
      } else {
        document.getElementById('search-screen').style.display = 'none';
        document.getElementById('chat-container').classList.remove('active');
        document.getElementById('image-gen-screen').style.display = 'flex';
      }
    }

    // Добавление сообщения
    function addMessage(text, isUser, saveToHistory = true) {
      if (saveToHistory) {
        saveMessage(text, isUser);
      }

      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;

      messageDiv.innerHTML = `
        <div class="message-avatar">${isUser ? 'Вы' : 'A'}</div>
        <div class="message-content">
          <div class="message-text">${text}</div>
          <div class="message-time">${getCurrentTime()}</div>
        </div>
      `;

      const chatMessages = document.getElementById('chat-messages');
      chatMessages.appendChild(messageDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Получение ответа от AI
    function fetchBotResponse(userMessage) {
      const chatMessages = document.getElementById('chat-messages');

      // Индикатор набора
      const typingIndicator = document.createElement('div');
      typingIndicator.className = 'typing-indicator';
      typingIndicator.innerHTML = `
        <div class="typing-dots">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
        <span>AIST друкуе...</span>
      `;
      chatMessages.appendChild(typingIndicator);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      fetch('http://localhost:5030/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMessage })
      })
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        typingIndicator.remove();
        let botText = data.response || 'Не атрымалася атрымаць адказ.';
        if (botText.startsWith(userMessage)) {
          botText = botText.slice(userMessage.length).trim();
        }
        if (!botText) botText = '...';
        addMessage(botText, false);
      })
      .catch(error => {
        console.error('Error:', error);
        typingIndicator.remove();
        addMessage('Памылка злучэння з AI-серверам.', false);
      });
    }

    // Генерация изображений
    function generateImage() {
      if (!dcganLoaded) {
        document.getElementById('image-results').innerHTML = `
          <div class="loading-indicator">
            <div class="spinner"></div>
            <p>Загрузка AI-мадэлі...</p>
          </div>`;
        return;
      }

      const prompt = document.getElementById('image-gen-input').value.trim();
      if (!prompt) return;

      const imageResults = document.getElementById('image-results');
      imageResults.innerHTML = `
        <div class="loading-indicator">
          <div class="spinner"></div>
          <p>Генеруем выяву AI...</p>
        </div>`;

      if (dcganCanvas) {
        dcganCanvas.remove();
        dcganCanvas = null;
      }

      dcgan.generate((err, result) => {
        if (err) {
          imageResults.innerHTML = `<div style="color:#e57373;">Памылка генерацыі выявы: ${err.message}</div>`;
          return;
        }

        imageResults.innerHTML = `
          <div class="image-grid">
            <div class="image-card" id="dcgan-image-card"></div>
          </div>`;

        dcganCanvas = document.createElement('canvas');
        dcganCanvas.width = result.image.width;
        dcganCanvas.height = result.image.height;
        dcganCanvas.style.width = '100%';
        dcganCanvas.style.height = '250px';
        dcganCanvas.style.objectFit = 'cover';

        const ctx = dcganCanvas.getContext('2d');
        ctx.putImageData(result.image, 0, 0);

        const imageCard = document.getElementById('dcgan-image-card');
        imageCard.appendChild(dcganCanvas);

        const downloadBtn = document.createElement('a');
        downloadBtn.className = 'download-btn';
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Спампаваць';
        downloadBtn.href = dcganCanvas.toDataURL('image/png');
        downloadBtn.download = 'generated.png';
        imageCard.appendChild(downloadBtn);
      });
    }

    // Активация кнопки генерации изображений
    function enableImageGenButton() {
      const btn = document.getElementById('image-gen-button');
      if (btn) {
        btn.disabled = false;
        btn.style.opacity = 1;
      }
    }

    // Запуск чата из поисковой строки
    function startChat() {
      const query = document.getElementById('search-input').value.trim();
      if (!query) return;

      if (!currentChatId || !chats[currentChatId]) {
        createNewChat();
      }

      const searchScreen = document.getElementById('search-screen');
      searchScreen.style.opacity = '0';
      searchScreen.style.transform = 'translateY(-20px)';

      setTimeout(() => {
        searchScreen.style.display = 'none';
        document.getElementById('chat-container').classList.add('active');

        addMessage(query, true);
        fetchBotResponse(query);
      }, 500);
    }

    // Отправка сообщений в чате
    function sendMessage() {
      const message = document.getElementById('chat-input').value.trim();
      if (!message) return;

      addMessage(message, true);
      document.getElementById('chat-input').value = '';
      fetchBotResponse(message);
    }

    // Получение текущего времени
    function getCurrentTime() {
      const now = new Date();
      return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    }

    // Адаптация для мобильных устройств
    function handleMobileView() {
      if (window.innerWidth <= 768) {
        // Удаляем старый тоггл, если он есть
        const oldToggle = document.querySelector('.mobile-menu-toggle');
        if (oldToggle) oldToggle.remove();

        const menuToggle = document.createElement('div');
        menuToggle.className = 'mobile-menu-toggle';
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        menuToggle.style.position = 'fixed';
        menuToggle.style.left = '16px';
        menuToggle.style.top = '16px';
        menuToggle.style.zIndex = '100';
        menuToggle.style.background = 'var(--card-bg)';
        menuToggle.style.width = '40px';
        menuToggle.style.height = '40px';
        menuToggle.style.borderRadius = 'var(--border-radius)';
        menuToggle.style.display = 'flex';
        menuToggle.style.alignItems = 'center';
        menuToggle.style.justifyContent = 'center';
        menuToggle.style.boxShadow = 'var(--shadow-sm)';
        menuToggle.style.cursor = 'pointer';
        menuToggle.style.transition = 'var(--transition)';

        menuToggle.addEventListener('click', () => {
          document.getElementById('sidebar').classList.toggle('visible');
        });

        menuToggle.addEventListener('mouseenter', () => {
          menuToggle.style.transform = 'scale(1.05)';
        });

        menuToggle.addEventListener('mouseleave', () => {
          menuToggle.style.transform = 'none';
        });

        document.body.appendChild(menuToggle);
      } else {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        if (mobileToggle) mobileToggle.remove();
        document.getElementById('sidebar').classList.remove('visible');
      }
    }



    // Обработчик изменения размера окна
    window.addEventListener('resize', handleMobileView);
