/**
 *
 * @author AmosT <amostankoano@gmail.com>
 * @since v1.0
 * @version 1.0
 *@date 2018-04-01
 *
 * Point d'entree
 *
 */
const _CONFIGS = require('./configs');
const http = require('http');
const app = require('./app');
const port = process.env.PORT || _CONFIGS.params.server.port;
const server = http.createServer(app);

server.listen(port);
