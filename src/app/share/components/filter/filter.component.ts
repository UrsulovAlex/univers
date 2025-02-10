import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Filter } from '../../../core/interfaces/filter.interface';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CreatorList } from '../../../page/dashboard/config';

@Component({
    selector: 'app-filter',
    imports: [MatInputModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatSelectModule, MatTooltipModule],
    templateUrl: './filter.component.html',
    styleUrl: './filter.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent {
    statusFilter = input<Filter[]>([]);
    userRole= input<string>('USER');
    outPutFilter = output<{[key:string]: string}>();
    selectedValue = signal<{[key: string]: string} >({
        status: '',
        creator: '',
    });
    creatorList = input<CreatorList[]>([])

    clearFilters (filter: string) {
        switch(filter) {
            case 'status': 
                this.selectedValue.update(value => ({...value, status: ''}));
                this.outPutFilter.emit({'status': ''});
                break;
            case 'creator': {
                this.outPutFilter.emit({'creator': ''});
                this.selectedValue.update(value => ({...value, creator: ''}));
                break;
            }
        }
    }

    selectStatus(event: MatSelectChange, status: string) {
        switch(status) {
            case 'status': 
                this.outPutFilter.emit({'status': event.value});
                this.selectedValue.update(value => ({...value, status: event.value}));
                break;
            case 'creator': {
                this.outPutFilter.emit({'creator': event.value});
                this.selectedValue.update(value => ({...value, creator: event.value}));
                break;
            }
        }

    }
}
