import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSchema } from 'type-graphql';
import { AppDataSource } from './config/database';
import ProductsResolver from './resolvers/ProductResolver';
import { BrandResolver } from './resolvers/BrandResolver';
import { DashboardResolver } from './resolvers/DashboardResolver';
import { ContactResolver } from './resolvers/ContactResolver';
import { CategoryResolver } from './resolvers/CategoryResolver';
import { TagResolver } from './resolvers/TagResolver';
import { UserResolver } from './resolvers/UserResolver';
import { createContext } from './middleware/createContext';

async function bootstrap() {
  // Initialisation de la base de données
  await AppDataSource.initialize();
  console.info('📦 Database connected successfully');

  // Construction du schéma GraphQL
  const schema = await buildSchema({
    resolvers: [
      ProductsResolver,
      BrandResolver,
      DashboardResolver,
      ContactResolver,
      CategoryResolver,
      TagResolver,
      UserResolver,
    ],
    validate: false,
  });

  // Création du serveur Apollo
  const server = new ApolloServer({
    schema,
  });

  // Démarrage du serveur standalone
  const { url } = await startStandaloneServer(server, {
    context: createContext,
    listen: { port: 4000 },
  });

  console.info(`🚀 Server ready at ${url}`);
}

bootstrap().catch(console.error);
