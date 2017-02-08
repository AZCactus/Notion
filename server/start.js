'use strict';

const chalk =  require('chalk');
const app = require('./index');
const server = require('http').createServer(app);
const port = process.env.PORT || 3030;

require('./models');

require('./sockets')(server);

server.listen(port, () => {
  console.log(chalk.bgMagenta.cyan.italic(`____ Listening on port ${port}. ____`));
});
