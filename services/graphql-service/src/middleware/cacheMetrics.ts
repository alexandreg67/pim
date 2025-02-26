import { GraphQLResolveInfo } from 'graphql';
import { Context } from '../types/Context';

// Middleware pour collecter les métriques de cache
export const cacheMetricsMiddleware = async (
  {
    context,
    info,
  }: {
    root: unknown;
    args: Record<string, unknown>;
    context: Context;
    info: GraphQLResolveInfo;
  },
  next: () => Promise<unknown>
) => {
  // Démarrer le chronomètre
  const startTime = Date.now();

  // Marquer si la requête a utilisé le cache (définir dans les résolveurs)
  let isFromCache = false;

  // Exécuter la requête ou mutation
  // Ajouter un helper sur le contexte
  context.setCacheHit = () => {
    isFromCache = true;
  };

  const result = await next();

  // Calculer le temps d'exécution
  const executionTime = Date.now() - startTime;

  // Log des performances (envoie possible à un service de télémétrie)
  console.info(
    `🔍 GraphQL ${info.fieldName} - ${executionTime}ms - Cache: ${isFromCache ? 'HIT' : 'MISS'}`
  );

  return result;
};
