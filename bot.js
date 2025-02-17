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

  // if use sends "/start"
  if (text === '/start') {
    // اگر قبلاً interval برای این چت وجود داشته باشد، آن را پاک کنید
    if (intervals[chatId]) {
      clearInterval(intervals[chatId]);
    }

    // هر 60 ثانیه یک پیام "Hello World!" ارسال کنید
    intervals[chatId] = setInterval(() => {
      // Define API URLs
      const apiUrls = [
        'https://min-api.cryptocompare.com/data/v2/histohour?fsym=BTC&tsym=USD&limit=72',
        'https://min-api.cryptocompare.com/data/v2/histohour?fsym=BTC&tsym=USD&limit=72',
        'https://min-api.cryptocompare.com/data/v2/histohour?fsym=BTC&tsym=USD&limit=72',
        'https://min-api.cryptocompare.com/data/v2/histohour?fsym=BTC&tsym=USD&limit=72',
      ];

      async function fetchData() {
        try {
          const response = await fetch(apiUrl);
          if (!response.ok) {
            throw new Error('err');
          }
          const jsonData = await response.json();

          // You can now use jsonData here or return it
          return jsonData;
        } catch (error) {
          console.log("error in api", error); // Log the error for debugging
        }
      }

      // Fetch data from multiple APIs simultaneously
      Promise.all(apiUrls.map(fetchData)).then((responses) => {
        // Process the responses
        responses.forEach((response, index) => {
          const data = response;
          const candles = data.Data.Data;

          bot.sendMessage(chatId, `rsi -->${rsi(candles)[rsi(candles).length - 1]} for ${apiUrls[index]}`);
          bot.sendMessage(chatId, `sma -->${sma(candles)[sma(candles).length - 1]} for ${apiUrls[index]}`);
          // it checks the conditions to see if it can send message?
          if ((rsi(candles)[rsi(candles).length - 1]) < 35 || (rsi(candles)[rsi(candles).length - 1] > 65)) {
            bot.sendMessage(chatId, `its time to trade for ${apiUrls[index]}`);
          }
        });
      });
    }, 60000); // 60000 میلی‌ثانیه = 60 ثانیه

    bot.sendMessage(chatId, 'شروع شد! هر 60 ثانیه یک Hello World! ارسال می‌شود.');
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

// Function to calculate RSI using RMA (Relative Moving Average)
function rsi(candles, period = 14) {
  if (candles.length < period) {
    throw new Error("Not enough data to calculate RSI");
  }

  // Extract closing prices
  const closes = candles.map(candle => candle.close);

  // Calculate gains and losses
  let gains = [];
  let losses = [];
  for (let i = 1; i < closes.length; i++) {
    const change = closes[i] - closes[i - 1];
    gains.push(change >= 0 ? change : 0); // Gains are positive changes
    losses.push(change < 0 ? Math.abs(change) : 0); // Losses are absolute values of negative changes
  }

  // Function to calculate RMA (Relative Moving Average)
  function calculateRMA(values, period) {
    let rma = [];
    let sum = 0;

    // Calculate the first RMA as the SMA (Simple Moving Average)
    for (let i = 0; i < period; i++) {
      sum += values[i];
    }
    rma.push(sum / period);

    // Calculate subsequent RMAs using the RMA formula
    for (let i = period; i < values.length; i++) {
      rma.push((values[i] + (rma[i - period] * (period - 1))) / period);
    }

    return rma;
  }

  // Calculate RMA for gains and losses
  const avgGain = calculateRMA(gains, period);
  const avgLoss = calculateRMA(losses, period);

  // Calculate RSI
  let rsiValues = [];
  for (let i = 0; i < avgGain.length; i++) {
    if (avgLoss[i] === 0) {
      rsiValues.push(100); // Avoid division by zero
    } else {
      const rs = avgGain[i] / avgLoss[i];
      const singleRsi = 100 - (100 / (1 + rs));
      rsiValues.push(singleRsi);
    }
  }

  return rsiValues;
}

// Function to calculate SMA (Simple Moving Average)
function sma(candles, period = 14) {
  if (candles.length < period) {
    throw new Error("Not enough data to calculate SMA");
  }

  // Extract closing prices
  const closes = candles.map(candle => candle.close);

  // Calculate SMA
  let smaValues = [];
  for (let i = period - 1; i < closes.length; i++) {
    const sum = closes.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    const sma = sum / period;
    smaValues.push(sma);
  }

  return smaValues;
}

console.log('bot is running');
