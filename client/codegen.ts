import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:8000/api',
  documents: ['src/graphql/*.ts'],
  generates: {
    './src/generated/graphql-types.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        withHooks: true,
        scalars: {
          DateTime: 'Date',
          DateTimeISO: 'Date',
          JSONObject: 'Record<string, unknown>',
        },
      },
    },
  },
  overwrite: true,
};

export default config;
