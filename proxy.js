const httpProxy = require('http-proxy');

httpProxy.createProxyServer({target:'http://0.0.0.0:8088'}).listen(9088);
httpProxy.createProxyServer({target:'http://0.0.0.0:8088'}).listen(9089);
httpProxy.createProxyServer({target:'http://0.0.0.0:8088'}).listen(9090);
httpProxy.createProxyServer({target:'http://0.0.0.0:8088'}).listen(9091);
