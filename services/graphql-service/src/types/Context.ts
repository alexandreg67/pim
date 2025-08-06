import { Users } from '../entities/Users';
import { HistoryService } from '../services/HistoryService';
import { Loaders } from '../middleware/dataLoaders';

export interface Context {
  req: {
    headers: {
      cookie?: string;
    };
  };
  user?: Users | null;
  historyService: HistoryService;
  loaders?: Loaders;
  ipAddress?: string;
  userAgent?: string;
  setCacheHit?: () => void;
}
