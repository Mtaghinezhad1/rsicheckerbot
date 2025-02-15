const TelegramBot = require('node-telegram-bot-api');

// توکن ربات خود را از BotFather دریافت کنید و جایگزین کنید
const token = '8159631062:AAEyUWtQYMb5YR_zTWvgUkOO9oFCVkrhfVw';

// ایجاد یک نمونه از ربات
const bot = new TelegramBot(token, { polling: true });

// شیء برای ذخیره intervalها بر اساس chatId
const intervals = {};

// هنگامی که کاربر پیامی ارسال می‌کند
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // اگر کاربر پیام "/start" را ارسال کند
  if (text === '/start') {
    // اگر قبلاً interval برای این چت وجود داشته باشد، آن را پاک کنید
    if (intervals[chatId]) {
      clearInterval(intervals[chatId]);
    }

    // هر 5 ثانیه یک پیام "Hello World!" ارسال کنید
    intervals[chatId] = setInterval(() => {
      bot.sendMessage(chatId, 'Hello World!');
    }, 5000); // 5000 میلی‌ثانیه = 5 ثانیه

    bot.sendMessage(chatId, 'شروع شد! هر 5 ثانیه یک Hello World! ارسال می‌شود.');
  }

  // اگر کاربر پیام "/stop" را ارسال کند
  if (text === '/stop') {
    // اگر interval برای این چت وجود داشته باشد، آن را متوقف کنید
    if (intervals[chatId]) {
      clearInterval(intervals[chatId]);
      delete intervals[chatId]; // حذف interval از شیء intervals
      bot.sendMessage(chatId, 'متوقف شد! دیگر پیامی ارسال نمی‌شود.');
    } else {
      bot.sendMessage(chatId, 'هیچ interval فعالی وجود ندارد.');
    }
  }
});

console.log('bot is running');
