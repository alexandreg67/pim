import { PluginDefinition } from '@apollo/server';

const MAX_DEPTH = Number(process.env.GRAPHQL_MAX_DEPTH ?? 8);

export const depthLimitPlugin = (): PluginDefinition => ({
  async requestDidStart() {
    return {
      async didResolveOperation() {
        // Placeholder for a future depth computation; kept configurable
        void MAX_DEPTH;
      },
    };
  },
});
