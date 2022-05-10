const httpProxy = require('http-proxy');

httpProxy.createProxyServer({target:'http://0.0.0.0:8088'}).listen(8089);
httpProxy.createProxyServer({target:'http://0.0.0.0:8088'}).listen(8090);
httpProxy.createProxyServer({target:'http://0.0.0.0:8088'}).listen(8091);
