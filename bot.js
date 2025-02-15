const TelegramBot = require('node-telegram-bot-api');

// توکن ربات خود را از BotFather دریافت کنید و جایگزین کنید
const token = '8159631062:AAEyUWtQYMb5YR_zTWvgUkOO9oFCVkrhfVw';

// ایجاد یک نمونه از ربات
const bot = new TelegramBot(token, { polling: true });

// هنگامی که کاربر پیامی ارسال می‌کند
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // اگر کاربر پیام "/start" را ارسال کند
  if (text === '/start') {
    bot.sendMessage(chatId, 'Hello Worldddddddddd!');
  }
});

console.log('bot is running');
