import express from "express";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./type-defs";
import { resolvers } from "./resolvers";
import { connectDatabase } from "./config/database";

async function startServer() {
  // Подключаемся к MongoDB
  await connectDatabase();

  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ req, res }), // общие данные
  });

  await server.start();

  // подключает GraphQL сервер к Express серверу
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(
      `Server ready at http://localhost:${PORT}${server.graphqlPath}`,
    );
  });
}

startServer().catch((error) => {
  console.error("Error:", error);
});
