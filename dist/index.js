Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {};
module.exports = exports['default'];

var http = require('http');

const PORT=3000;

function errorJSON(error_number) {
	var error = [{}];
	if (error_number === 400) {
		error = [{code: error_number, type: 'Bad Request', description: 'The request could not be understood by the server due to malformed syntax.'}];
	} else if (error_number === 413) {
		error = [{code: error_number, type: 'Request Entity Too Large', description: 'The server is refusing to process a request because the request entity is larger than the server is willing or able to process.'}];
	} else if (error_number === 501) {
		error = [{code: error_number, type: 'Not Implemented', description: 'The server does not support the functionality required to fulfill the request.'}];
	}
	return error;
}

function handleRequest(request, response){
	if (request.method === "GET") {
		response.end('It Works!! Path Hit: ' + request.url);
	}
	else if (request.method === "POST") {
		var requestBody = '';
      	request.on('data', function(data) {
	        requestBody += data;
	        if(requestBody.length > 1e7) {
	        	response.writeHead(413, {'Content-Type': 'application/json'});
				response.end(JSON.stringify(errorJSON(413)));
	        }
	        try {
		    	JSON.parse(requestBody);
			} catch (e) {
		    	response.writeHead(400, {'Content-Type': 'application/json'});
		    	response.end(JSON.stringify(errorJSON(400)));
		    }
		    response.writeHead(200, {'Content-Type': 'text/html'});
		    response.end('Request accepted. Data received as:\n\n' + requestBody)
      	});
	}
	else {
		response.writeHead(501, {'Content-Type': 'application/json'});
		response.end(JSON.stringify(errorJSON(501)));
	}
}

var server = http.createServer(handleRequest);

server.listen(PORT, function(){
    console.log("notify-server is listening on: http://localhost:%s", PORT);
});