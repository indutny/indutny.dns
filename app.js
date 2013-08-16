var dnsd = require('dnsd');
var config = require('./config.json');

dnsd.createServer(function(req, res) {
  // Loopback
  if (!res.question)
    return res.end('127.0.0.1');

  res.question.forEach(function(question) {
    function answer(data) {
      res.answer.push({
        name: question.name,
        type: question.type,
        data: data,
        ttl: config.TTL
      });
    }
    if (question.type === 'A' &&
        config.A.hasOwnProperty(question.name)) {
      answer(config.A[question.name]);
    } else if (question.type === 'MX') {
      // Google apps
      answer([1, 'ASPMX.L.GOOGLE.COM']);
      answer([5, 'ALT1.ASPMX.L.GOOGLE.COM']);
      answer([5, 'ALT2.ASPMX.L.GOOGLE.COM']);
      answer([10, 'ASPMX2.GOOGLEMAIL.COM']);
      answer([10, 'ASPMX3.GOOGLEMAIL.COM']);
    }
  });
  res.end();
}).listen(5354, '127.0.0.1', function() {
  var addr = this.address();
  console.log('Server running at %s:%d', addr.address, addr.port);
});
