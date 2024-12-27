import { Users } from '../entities/Users';
import { HistoryService } from '../services/HistoryService';

export interface Context {
  user?: Users | null;
  historyService: HistoryService;
  ipAddress?: string;
  userAgent?: string;
}
