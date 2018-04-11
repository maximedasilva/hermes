/* ------------------------------------------
   Hermes Bridge core
--------------------------------------------- */
const http = require('http')
const net = require('net')

const createClientsManager = require('./ClientsManager')
const createLogger = require('./utils/logger')
// TODO @Nico : manage http / https

const responseFallback = {
  statusCode: 500,
  headers: {
    'content-type': 'application/json; charset=utf-8'
  },
  body: JSON.stringify({ error: 'No local server provided' })
}

const createBridgeServer = ({
  httpPort,
  socketPort,
  loggerLevel = 'verbose',
  clients = {},
  defaultResponse = responseFallback
}) => {
  const logger = createLogger(loggerLevel)

  const ClientsManager = createClientsManager({ logger })
  const manager = new ClientsManager(clients, defaultResponse)

  const httpServer = http.createServer(manager.createProviderRequestHandler.bind(manager))
  httpServer.listen(httpPort, () => {
    logger.line('verbose', 'cyan')
    logger.verbose(`HTTP server running on ${httpPort}`.cyan)
    logger.line('verbose', 'cyan')
  })

  const socketServer = net.createServer(manager.addAdaptor.bind(manager))
  socketServer.listen(socketPort, () => {
    logger.line('verbose', 'cyan')
    logger.verbose(`Socket server running on ${socketPort}`.cyan)
    logger.line('verbose', 'cyan')
  })
}

module.exports = createBridgeServer
