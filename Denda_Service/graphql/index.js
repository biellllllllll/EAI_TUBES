// File: User_Service/graphql/index.js (Versi Baru Apollo Server v4)

const express = require('express');
const http = require('http');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const typeDefs = require('./src/schema/typeDefs');
const resolvers = require('./src/resolvers/index'); // Pastikan path ini benar

require('dotenv').config();

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  // Buat skema subgraph
  const schema = buildSubgraphSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  // Terapkan middleware
  app.use(
    '/graphql',
    express.json(),
    expressMiddleware(server),
  );

  // Menggunakan port 4001 untuk User_Service
  const PORT = process.env.PORT || 4004;
  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(`🚀 Server Denda_Service siap di http://localhost:${PORT}/graphql`);
}

startServer();
