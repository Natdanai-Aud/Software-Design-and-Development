import { Injectable } from '@nestjs/common';
import { RankingService } from '../ranking/ranking.service';
import { RemediationService } from '../remediation/remediation.service';
import { CreateImportDto } from './dto/create-import.dto';
import { UpdateRemediationDto } from '../remediation/dto/update-remediation.dto';
import { ImportResult } from './import-result.model';

@Injectable()
export class AdminService {
  constructor(
    private readonly rankingService: RankingService,
    private readonly remediationService: RemediationService,
  ) {}

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

  updateRemediation(remediationId: string, dto: UpdateRemediationDto) {
    return this.remediationService.update(remediationId, dto);
  }
}
