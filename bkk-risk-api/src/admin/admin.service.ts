import { Injectable } from '@nestjs/common';
import { ImportResult } from '../common/models';
import { CreateImportDto } from './dto/create-import.dto';
import { RankingService } from '../ranking/ranking.service';

@Injectable()
export class AdminService {
  constructor(private readonly rankingService: RankingService) {}

  createImport(dto: CreateImportDto): ImportResult {
    const startedAt = new Date().toISOString();

    // In-memory mock of: Raw Data -> Data Cleaning -> Storage.
    const result: ImportResult = {
      source: dto.source,
      totalRows: 100,
      cleanedRows: 97,
      rejectedRows: 3,
      startedAt,
      finishedAt: new Date().toISOString(),
    };

    return result;
  }

  rebuildRanking() {
    return this.rankingService.rebuild();
  }
}
