import { Module } from '@nestjs/common';
import { RankingModule } from '../ranking/ranking.module';
import { RemediationModule } from '../remediation/remediation.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [RankingModule, RemediationModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
