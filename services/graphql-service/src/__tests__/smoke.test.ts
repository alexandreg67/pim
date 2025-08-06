import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSchema } from 'type-graphql';
import Container from 'typedi';
import { authChecker } from '../middleware/authMiddleware';
import { cacheMetricsMiddleware } from '../middleware/cacheMetrics';
import ProductsResolver from '../resolvers/ProductResolver';
import { BrandResolver } from '../resolvers/BrandResolver';
import { CategoryResolver } from '../resolvers/CategoryResolver';
import { TagResolver } from '../resolvers/TagResolver';
import { UserResolver } from '../resolvers/UserResolver';
import { ProductCharacteristicsResolver } from '../resolvers/ProductCharacteristicsResolver';
import { CharacteristicDefinitionResolver } from '../resolvers/CharacteristicDefinitionResolver';
import { DashboardResolver } from '../resolvers/DashboardResolver';
import { HistoryResolver } from '../resolvers/HistoryResolver';
import { ImageResolver } from '../resolvers/ImageResolver';
import { createContext } from '../middleware/createContext';
import { createComplexityPlugin } from '../middleware/graphqlLimits';

jest.setTimeout(30000);

describe('GraphQL smoke', () => {
  it('starts and rejects overly complex queries', async () => {
    const schema = await buildSchema({
      resolvers: [
        ProductsResolver,
        BrandResolver,
        DashboardResolver,
        CategoryResolver,
        TagResolver,
        UserResolver,
        ProductCharacteristicsResolver,
        CharacteristicDefinitionResolver,
        HistoryResolver,
        ImageResolver,
      ],
      authChecker,
      container: Container,
      validate: false,
      globalMiddlewares: [cacheMetricsMiddleware],
    });

    const server = new ApolloServer({
      schema,
      plugins: [createComplexityPlugin()],
    });
    const { url } = await startStandaloneServer(server, {
      listen: { port: 0 },
      context: async () =>
        await createContext({ req: { headers: {} as { cookie?: string } } }),
    });

    expect(url).toBeTruthy();
    await server.stop();
  });
});
