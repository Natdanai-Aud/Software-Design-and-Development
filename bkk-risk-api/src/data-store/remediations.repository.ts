import { Injectable } from '@nestjs/common';
import { Remediation } from '../remediation/remediation.model';

@Injectable()
export class RemediationsRepository {
  private items: Remediation[] = [];

  replaceAll(items: Remediation[]): void {
    this.items = items;
  }

  findAll(): Remediation[] {
    return [...this.items];
  }

  findById(remediationId: string): Remediation | undefined {
    return this.items.find((item) => item.remediationId === remediationId);
  }

  /** Mutates the stored record in place so a later findAll()/findById() sees the update. */
  update(
    remediationId: string,
    patch: Partial<Remediation>,
  ): Remediation | undefined {
    const item = this.findById(remediationId);
    if (!item) {
      return undefined;
    }
    Object.assign(item, patch);
    return item;
  }
}
