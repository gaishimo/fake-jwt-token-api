var http = require('http');
var url = require('url');
var uuid = require('node-uuid');
var jwt = require('jwt-simple');

function stringGen(len)
{
    var text = "";
    var charset = "abcdefghijkmnopqrstuvwxyz";
    for( var i=0; i < len; i++ )
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    return text;
}

function jwttoken() {
    var secret = uuid.v4().split('-').join('');
    var claims = {
        iss: uuid.v4().split('-').join(''),
    }
    var token = jwt.encode(claims, secret);
    return token;
}

http.createServer(function (request, response) {
  var query = url.parse(request.url,true).query;
  console.log('url: ', request.url, ', query: ', query);
  if (query["rp"])
  {
    var consumerId = stringGen(6);
    var token = jwttoken();

    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Request-Method', '*');
    response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
    response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (request.method === 'OPTIONS') {
      response.writeHead(200);
      response.end();
      return;
    }
    response.writeHead(200, {'Content-Type': 'application/json'});
    var json = JSON.stringify({
      consumerId: consumerId,
      token: token
    });
    console.log("response:", json);
    response.end(json);
  }
}).listen(8124);

console.log('Server running at http://127.0.0.1:8124/');
