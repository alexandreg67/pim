import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSchema } from 'type-graphql';
import { AppDataSource } from './config/database';
import { Brands } from './entities/Brands';
import { Categories } from './entities/Categories';

async function bootstrap() {
  // Initialisation de la base de données
  await AppDataSource.initialize();
  console.info('📦 Database connected successfully');

  // Construction du schéma GraphQL
  const schema = await buildSchema({
    resolvers: [Brands, Categories],
    validate: false,
  });

  // Création du serveur Apollo
  const server = new ApolloServer({
    schema,
  });

  // Démarrage du serveur standalone
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.info(`🚀 Server ready at ${url}`);
}

bootstrap().catch(console.error);
