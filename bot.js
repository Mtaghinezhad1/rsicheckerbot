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
        'https://min-api.cryptocompare.com/data/v2/histominute?fsym=BTC&tsym=USD&limit=72&aggregate=15',
        'https://min-api.cryptocompare.com/data/v2/histohour?fsym=BTC&tsym=USD&limit=72',
        'https://min-api.cryptocompare.com/data/v2/histohour?fsym=BTC&tsym=USD&limit=72&aggregate=4',
        'https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=72',
      ];

      async function fetchData(url) {
        try {
          const response = await fetch(url);
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
          // extract timeframe from api 
          let timeframe
          if (index == 0){
            timeframe = '15m';
          } else if (index == 1) {
            timeframe = '1h'
          } else if (index == 2) {
            timeframe = '4h'
          } else {
            timeframe = '1d'
          } 

          bot.sendMessage(chatId, `rsi --> ${timeframe} --> ${rsi(candles)[rsi(candles).length - 1]}`);
          bot.sendMessage(chatId, `sma --> ${timeframe} --> ${sma(candles)[sma(candles).length - 1]}`);
          // it checks the conditions to see if it can send message?
          if ((rsi(candles)[rsi(candles).length - 1]) < 35 || (rsi(candles)[rsi(candles).length - 1] > 65)) {
            bot.sendMessage(chatId, `its time to trade for ${apiUrls[index]}`);
          }
        });
      });
    }, 60000); // 60000 میلی‌ثانیه = 60 ثانیه

    bot.sendMessage(chatId, 'started. every 60 second');
  }
