
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

      // fetch api for loading data
      const apiUrl = 'https://min-api.cryptocompare.com/data/v2/histohour?fsym=BTC&tsym=USD&limit=72';
      let jsonData;
      // Define API URLs
      const apiUrls = [
        //S
        'https://min-api.cryptocompare.com/data/v2/histominute?fsym=S&tsym=USD&limit=72&aggregate=15',
        'https://min-api.cryptocompare.com/data/v2/histohour?fsym=S&tsym=USD&limit=72',
        'https://min-api.cryptocompare.com/data/v2/histohour?fsym=S&tsym=USD&limit=72&aggregate=4',
        'https://min-api.cryptocompare.com/data/v2/histoday?fsym=S&tsym=USD&limit=72',
        //XRP
        'https://min-api.cryptocompare.com/data/v2/histominute?fsym=XRP&tsym=USD&limit=72&aggregate=15',
        'https://min-api.cryptocompare.com/data/v2/histohour?fsym=XRP&tsym=USD&limit=72',
        'https://min-api.cryptocompare.com/data/v2/histohour?fsym=XRP&tsym=USD&limit=72&aggregate=4',
        'https://min-api.cryptocompare.com/data/v2/histoday?fsym=XRP&tsym=USD&limit=72',
        //API3
        'https://min-api.cryptocompare.com/data/v2/histominute?fsym=api3&tsym=USD&limit=72&aggregate=15',
        'https://min-api.cryptocompare.com/data/v2/histohour?fsym=api3&tsym=USD&limit=72',
        'https://min-api.cryptocompare.com/data/v2/histohour?fsym=api3&tsym=USD&limit=72&aggregate=4',
        'https://min-api.cryptocompare.com/data/v2/histoday?fsym=api3&tsym=USD&limit=72',
        //ADA
        'https://min-api.cryptocompare.com/data/v2/histominute?fsym=ADA&tsym=USD&limit=72&aggregate=15',
        'https://min-api.cryptocompare.com/data/v2/histohour?fsym=ADA&tsym=USD&limit=72',
        'https://min-api.cryptocompare.com/data/v2/histohour?fsym=ADA&tsym=USD&limit=72&aggregate=4',
        'https://min-api.cryptocompare.com/data/v2/histoday?fsym=ADA&tsym=USD&limit=72',
        //NEAR
        'https://min-api.cryptocompare.com/data/v2/histominute?fsym=NEAR&tsym=USD&limit=72&aggregate=15',
        'https://min-api.cryptocompare.com/data/v2/histohour?fsym=NEAR&tsym=USD&limit=72',
        'https://min-api.cryptocompare.com/data/v2/histohour?fsym=NEAR&tsym=USD&limit=72&aggregate=4',
        'https://min-api.cryptocompare.com/data/v2/histoday?fsym=NEAR&tsym=USD&limit=72',
        //DOGE
        'https://min-api.cryptocompare.com/data/v2/histominute?fsym=DOGE&tsym=USD&limit=72&aggregate=15',
        'https://min-api.cryptocompare.com/data/v2/histohour?fsym=DOGE&tsym=USD&limit=72',
        'https://min-api.cryptocompare.com/data/v2/histohour?fsym=DOGE&tsym=USD&limit=72&aggregate=4',
        'https://min-api.cryptocompare.com/data/v2/histoday?fsym=DOGE&tsym=USD&limit=72',
        //SOL
        'https://min-api.cryptocompare.com/data/v2/histominute?fsym=SOL&tsym=USD&limit=72&aggregate=15',
        'https://min-api.cryptocompare.com/data/v2/histohour?fsym=SOL&tsym=USD&limit=72',
        'https://min-api.cryptocompare.com/data/v2/histohour?fsym=SOL&tsym=USD&limit=72&aggregate=4',
        'https://min-api.cryptocompare.com/data/v2/histoday?fsym=SOL&tsym=USD&limit=72',
      ];

      async function fetchData(url) {
        for (let i = 0; i < 3; i++) {  // 3 is the number of retry
          try {
            const response = await fetch(url);
            // checks if it has a response from api
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const jsonData = await response.json();
            // checks if its over rate limit of that api
            //if (jsonData.Response == 'Error') {console.log(`rate limit --> ${i}`)};
            if (jsonData.Response == 'Error') throw new Error(`HTTP error! status: rate limit`);
            return jsonData;
          } catch (error) {
            console.warn(`Trying (${i + 1}/3)...`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
          }
        }
      }

      // Fetch data from multiple APIs simultaneously
      Promise.all(apiUrls.map(fetchData)).then((responses) => {
        // Process the responses
        responses.forEach((response, index) => {
          if (!response || !response.Data || !response.Data.Data) {
            console.error(`Invalid or empty response for API at index ${index}`);
            return; // Skip this iteration
          }

          const data = response;
          const candles = data.Data.Data;
          let timeframe
          if (index % 4 == 0) {
            timeframe = '15m';
          } else if (index % 4 == 1) {
            timeframe = '1h'
          } else if (index % 4 == 2) {
            timeframe = '4h'
          } else {
            timeframe = '1d'
          }

          let coin
          if (Math.floor(index / 4) == 0) {
            coin = 'S';
          }
          if (Math.floor(index / 4) == 1) {
            coin = 'XRP';
          }
          if (Math.floor(index / 4) == 2) {
            coin = 'API3';
          }
          if (Math.floor(index / 4) == 3) {
            coin = 'ADA';
          }
          if (Math.floor(index / 4) == 4) {
            coin = 'NEAR';
          }
          if (Math.floor(index / 4) == 5) {
            coin = 'DOGE';
          }
          if (Math.floor(index / 4) == 6) {
            coin = 'SOL';
          }

          //bot.sendMessage(chatId, `rsi --> ${timeframe} --> ${coin} --> ${rsi(candles)[rsi(candles).length - 1]}`);
          
          // it checks the conditions to see if it can send message?
          if ((rsi(candles)[rsi(candles).length - 1]) < 35 || (rsi(candles)[rsi(candles).length - 1] > 65)) {
            bot.sendMessage(chatId, `time to trade for +65 -35 --> ${timeframe} --> ${coin}`);
          }
          else if (detectRSISignal(rsi(candles)) && detectTrend(candles) != 'Sideways') {
            bot.sendMessage(chatId, `time to trade for 50 --> ${timeframe} --> ${coin}`);
          }
        });
      });
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

// function to check rsi reached the level 50
function detectRSISignal(rsiValues) {
  let crossedAbove65 = false;
  let crossedUnder35 = false;

  for (let i = 0; i < rsiValues.length; i++) {
    if (rsiValues[i] > 65) {
      crossedAbove65 = true;
    }
    if (rsiValues[i] < 35) {
      crossedUnder35 = true;
    }
    if (crossedAbove65 && rsiValues[rsiValues.length - 1] <= 51) {
      return true;
    }
    if (crossedUnder35 && rsiValues[rsiValues.length - 1] >= 49) {
      return true;
    }

  }
  return false;
}

// function to detect trend
function detectTrend(candles) {
  let sma9 = sma(candles, 9); let sma21 = sma(candles, 21);

  if (sma9[sma9.length - 1] > sma21[sma21.length - 1]) {
    return "Uptrend";
  } else if (sma9[sma9.length - 1] < sma21[sma21.length - 1]) {
    return "Downtrend";
  } else {
    return "Sideways";
  }
}

console.log('bot is running');
