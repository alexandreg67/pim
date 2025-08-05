import DataLoader from 'dataloader';
import { In } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Brands } from '../entities/Brands';
import { Categories } from '../entities/Categories';
import { Tags } from '../entities/Tags';

export type Loaders = {
  brandById: DataLoader<string, Brands | null>;
  categoryById: DataLoader<string, Categories | null>;
  tagById: DataLoader<string, Tags | null>;
};

export const createLoaders = (): Loaders => {
  return {
    brandById: new DataLoader(async (ids: readonly string[]) => {
      const repo = AppDataSource.getRepository(Brands);
      const rows = await repo.findBy({ id: In(ids as string[]) });
      const map = new Map(rows.map((r) => [r.id, r]));
      return ids.map((id) => map.get(id) ?? null);
    }),
    categoryById: new DataLoader(async (ids: readonly string[]) => {
      const repo = AppDataSource.getRepository(Categories);
      const rows = await repo.findBy({ id: In(ids as string[]) });
      const map = new Map(rows.map((r) => [r.id, r]));
      return ids.map((id) => map.get(id) ?? null);
    }),
    tagById: new DataLoader(async (ids: readonly string[]) => {
      const repo = AppDataSource.getRepository(Tags);
      const rows = await repo.findBy({ id: In(ids as string[]) });
      const map = new Map(rows.map((r) => [r.id, r]));
      return ids.map((id) => map.get(id) ?? null);
    }),
  };
};
