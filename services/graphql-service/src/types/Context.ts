import { Users } from '../entities/Users';
import { HistoryService } from '../services/HistoryService';

export interface Context {
  req: {
    headers: {
      cookie?: string;
    };
  };
  user?: Users | null;
  historyService: HistoryService;
  ipAddress?: string;
  userAgent?: string;
  setCacheHit?: () => void;
}
