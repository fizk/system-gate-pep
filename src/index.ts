import http from 'http';
import httpProxy from 'http-proxy';
import pdp from './pdp';

const PROXY_PORT = process.env.PROXY_PORT || 5050;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const FORWARD_URL = process.env.FORWARD_URL || 'http://0.0.0.0:1234';

const proxy = httpProxy.createProxyServer({});
const server = http.createServer((req, res) => {
    pdp(JWT_SECRET, req.url || '', req.method || '', req.headers).then(result => {
        proxy.web(req, res, {
            target: FORWARD_URL,
            headers: result.id ? {'x-user-id': result.id} : {}
        });
    }).catch(error => {
        res.statusCode = 403;
        res.end(error.message);
    });
});

server.listen(PROXY_PORT, () => {
    console.log(`Proxy listening on port ${PROXY_PORT}`);
    console.log(`Forwarding to ${FORWARD_URL}`);
});
