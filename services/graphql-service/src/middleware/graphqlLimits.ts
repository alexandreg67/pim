import { GraphQLError } from 'graphql';
import {
  createComplexityRule,
  simpleEstimator,
} from 'graphql-query-complexity';
import { PluginDefinition } from '@apollo/server';

export const createComplexityPlugin = (): PluginDefinition => {
  const maxComplexity = Number(process.env.GRAPHQL_MAX_COMPLEXITY ?? 200);
  return {
    async requestDidStart() {
      return {
        async didResolveOperation({ document }) {
          if (!document) return;
          const rule = createComplexityRule({
            maximumComplexity: maxComplexity,
            estimators: [simpleEstimator({ defaultComplexity: 1 })],
            onComplete: (complexity: number) => {
              if (complexity > maxComplexity) {
                throw new GraphQLError('Query is too complex', {
                  extensions: { code: 'QUERY_TOO_COMPLEX' },
                });
              }
            },
          });
          void rule; // placeholder to satisfy lint until integrated into validation phase
        },
      };
    },
  };
};

export const getBodySizeLimit = () =>
  String(process.env.GRAPHQL_BODY_LIMIT || '1mb');
