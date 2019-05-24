const http = require('http');
const url = require('url');
const fs = require('fs');

const port = process.env.PORT || 5000;

http.createServer((req, res) => {
    // will always send back plain text
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    const {pathname, query} = url.parse(req.url, true);

    // process only request to root with uri as query param
    if(pathname === "/" && query.uri) {

        // check accessibility file
        return fs.access(query.uri, fs.constants.R_OK, accessErr => {
            if(accessErr) {
               return sendErr(res, 404, 'File not found!');
            };
            const stream = fs.createReadStream(query.uri);
            // stream it back
            stream.pipe(res);
        });
    };

    res.writeHead(200);
    res.end('The heck you doing here? Go away! >.<')
}).listen(port);

// error handler function, for known errors
function sendErr(res, statusCode, message) {
    res.writeHead(statusCode);
    res.end(message);
};

// shutdown server when unknown error occurs
process.on('uncaughtException', serverErr => {
    console.error('serverErr', serverErr);
    process.exit(1);
});
