  console.log('public/javascripts/SocketIn.js loaded')

  const refresh_rate = 1000;
  //Polling Cheat!
  window.setInterval(function(){
    window.location.reload();
  }, refresh_rate)

  //Attempted websocket implemetation
  // var socket = io.connect('http://localhost:3000');
  //
  // socket.on('news', function (data) {
  //   console.log(data);
  //   socket.emit('my other event', { my: 'data' });
  // });
