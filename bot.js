const TelegramBot = require('node-telegram-bot-api');

// توکن ربات خود را از BotFather دریافت کنید و جایگزین کنید
const token = '8159631062:AAEyUWtQYMb5YR_zTWvgUkOO9oFCVkrhfVw';

// ایجاد یک نمونه از ربات
const bot = new TelegramBot(token, { polling: true });

// شیء برای ذخیره intervalها بر اساس chatId
const intervals = {};

// تابع برای ایجاد منوی کیبورد شیشه‌ای
function createMenu() {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'شروع', callback_data: '/start' },
          { text: 'توقف', callback_data: '/stop' }
        ]
      ]
    }
  };
}

// هنگامی که کاربر پیامی ارسال می‌کند
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // اگر کاربر پیام "/menu" را ارسال کند
  if (text === '/menu') {
    bot.sendMessage(chatId, 'لطفا یک گزینه را انتخاب کنید:', createMenu());
  }
});

// هنگامی که کاربر روی دکمه‌های کیبورد شیشه‌ای کلیک می‌کند
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  // اگر کاربر روی دکمه "شروع" کلیک کند
  if (data === '/start') {
    // اگر قبلاً interval برای این چت وجود داشته باشد، آن را پاک کنید
    if (intervals[chatId]) {
      clearInterval(intervals[chatId]);
    }

    // هر 10 ثانیه یک پیام "Hello World!" ارسال کنید
    intervals[chatId] = setInterval(() => {
      bot.sendMessage(chatId, 'Hello World!');
    }, 10000); // 10000 میلی‌ثانیه = 10 ثانیه

    bot.sendMessage(chatId, 'شروع شد! هر 5 ثانیه یک Hello World! ارسال می‌شود.');
  }

  // اگر کاربر روی دکمه "توقف" کلیک کند
  if (data === '/stop') {
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
