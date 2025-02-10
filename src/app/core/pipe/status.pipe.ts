import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {
    private statusMap: { [key: string]: string } = {
        DRAFT: 'Draft',
        REVOKE: 'Revoke',
        READY_FOR_REVIEW: 'Ready for review',
        UNDER_REVIEW: 'Under review',
        APPROVED: 'Approved',
        DECLINED: 'Declined'
    };

    transform(status: string): string {
        return this.statusMap[status] || 'Unknown status';
    }

}
