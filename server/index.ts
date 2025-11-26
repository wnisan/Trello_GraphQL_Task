import "reflect-metadata"; // Обязательно для TypeORM
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./type-defs";
import { resolvers } from "./resolvers";
import { AppDataSource } from "./data-source";

async function startServer() {
  const app = express();

  try {
    await AppDataSource.initialize();
    console.log("Connected to DB");
  } catch (error) {
    console.error("Connection to DB failed:", error);
    return;
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ req, res }), // общие данные
  });

  await server.start();

  // подключает GraphQL сервер к Express серверу
  server.applyMiddleware({ app });

  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(
      `Server ready at http://localhost:${PORT}${server.graphqlPath}`,
    );
  });
}

startServer().catch((error) => {
  console.error("Error:", error);
});
