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

jest.setTimeout(30000);

describe('GraphQL validation', () => {
  it('rejects invalid CreateProduct input', async () => {
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
      validate: true,
      globalMiddlewares: [cacheMetricsMiddleware],
    });

    const server = new ApolloServer({ schema });
    const { url } = await startStandaloneServer(server, {
      listen: { port: 0 },
      context: async () => ({ req: { headers: {} } }),
    });

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        query: `mutation($input: CreateProductDTO!) { createProduct(input: $input) { id } }`,
        variables: { input: { name: '', reference: '', price: '10' } },
      }),
    });

    const body = (await res.json()) as { errors?: unknown };
    expect(!!body.errors).toBe(true);
    await server.stop();
  });
});
