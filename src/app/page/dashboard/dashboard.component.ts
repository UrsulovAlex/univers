import { AfterViewInit, Component, DestroyRef, inject, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { DashboardService } from './services/dashboard.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PdfViewComponent } from '../../share/components/pdf-view/pdf-view.component';
import { CreatorList, NEW_DOCUMENT_STATUS, STATUS_FILTER_CONFIG, STATUS_LIST_REVIEWER, STATUS_LIST_USER } from './config';
import { NewDocStatus } from '../../core/interfaces/document.interface';
import { DocumentStatusType } from '../../core/Types/documentStatus';
import { AddNewDocumentComponent } from '../../share/components/add-new-document/add-new-document.component';
import { catchError, EMPTY, merge, startWith, switchMap, take, tap } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule,} from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { FilterComponent } from "../../share/components/filter/filter.component";
import { checkParams } from "../../core/helperFunction/checkQueryParams"
import { DocumentService } from '../../core/services/document.service';
import { UserService } from '../../core/services/user.service';
import {MatMenu, MatMenuModule, MatMenuTrigger} from '@angular/material/menu';
import {MatRadioChange, MatRadioModule} from '@angular/material/radio';
import { User } from '../../core/interfaces/user.interface';
import { UsetsStatusList } from '../../core/interfaces/usersStatusList';
import { ActivatedRoute } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../core/services/auth.service';
import { StatusPipe } from '../../core/pipe/status.pipe';

@Component({
	selector: 'app-dashboard',
	imports: [MatButtonModule, MatDialogModule, MatToolbarModule,MatTableModule, MatPaginatorModule, MatSortModule, DatePipe, MatIconModule, MatTooltipModule, FilterComponent, MatMenuModule, MatRadioModule, MatProgressSpinnerModule, MatInputModule, MatFormFieldModule, StatusPipe],
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements AfterViewInit {
	currentUser: User = inject(UserService).getUser();
	isLoading=signal<boolean>(false);
	NEW_DOCUMENT_STATUS: NewDocStatus[] = NEW_DOCUMENT_STATUS;
	newDocumentStatus = signal<DocumentStatusType>('READY_FOR_REVIEW');
	dataSource: any[] = [];
	displayedColumns: string[] = this.currentUser.role === 'REVIEWER' ? ['name', 'status', 'creator.fullName', 'updatedAt', 'action'] : ['name', 'status', 'updatedAt', 'action'];
	counterDoc: number = 0;
	STATUS_FILTER_CONFIG = STATUS_FILTER_CONFIG;
	cangeStatusList: UsetsStatusList[] = this.currentUser.role === 'REVIEWER' ? STATUS_LIST_REVIEWER : STATUS_LIST_USER;
	listCreator: CreatorList[] = [];
	authService = inject(AuthService);
	// STATUS_VIEW = STATUS_VIEW;

	readonly dialog = inject(MatDialog);
	private dashboardService = inject(DashboardService);
	private destroyRef = inject(DestroyRef);
	private activatedRoute = inject(ActivatedRoute).snapshot.data['data']['results'];
	private statusParams = '';
	private creatorParams = '';
	private documentService = inject(DocumentService);
	private snackBar = inject(MatSnackBar);
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;
	@ViewChild(MatMenu) chengeDocMatMenu!: QueryList<MatMenu>;
	@ViewChildren(MatMenuTrigger) menuTriggers!: QueryList<MatMenuTrigger>;

	ngAfterViewInit () {
		this.fetchData();
		if (this.currentUser.role === 'REVIEWER') {
			this.initListCreator();
		}
	}

	initListCreator(): void {
		const creatorResult = this.activatedRoute.map((item: any )=> ({id:item?.creator?.id, fullName: item?.creator?.fullName}));
		this.listCreator = creatorResult.filter((value: any, index: any, self: any[]) =>
			index === self.findIndex((obj: any) => JSON.stringify(obj) === JSON.stringify(value))
		);
	}

	fetchData(): void {
		this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		merge(this.sort.sortChange, this.paginator.page)
			.pipe(
				takeUntilDestroyed(this.destroyRef),
				startWith({}),
				switchMap(() => {
					this.isLoading.set(true);
					const sortParam = `${this.sort.active},${this.sort.direction}`;
					const initParams = {
						page: `${this.paginator.pageIndex + 1}`,
						size: `${this.paginator.pageSize}`,
						sort: sortParam,
						status: this.statusParams,
						creator: this.creatorParams,
					}

					return this.dashboardService.initData(
						checkParams(initParams)
					);
				}),
				catchError(() =>
				{
					console.log('Data fatch error')
					return EMPTY;
				})
			)
			.subscribe((data) => {
				this.dataSource = data.results;
				this.counterDoc = data.count;
				this.isLoading.set(false)
			});
	}

	applyFilter (event: {[key: string]: string }): void {
		switch(Object.keys(event)[0]) {
			case 'status': 
				this.statusParams = event['status']
				break;
			case 'creator': 
				this.creatorParams = event['creator']
				break;
		}
		this.fetchData();
	}


	openPreview (id: string): void {
		const dialogConfig = new MatDialogConfig();
		this.documentService.documentById(id).pipe(
			catchError((err) => {
				console.log('Show document error', err);
				return EMPTY;
			}),
			tap((data) => {
				dialogConfig.maxWidth = '80vw';
				dialogConfig.maxHeight = '100vh';
				dialogConfig.height = '100%';
				dialogConfig.width = '80%';
				dialogConfig.panelClass = 'full-screen-dialog';
				dialogConfig.disableClose = true;
				dialogConfig.data = data;
				this.dialog.open(PdfViewComponent, dialogConfig);
			})
		).subscribe();
	}

	addNewDocument(): void {
		const dialogRef = this.dialog.open(AddNewDocumentComponent, {
			data: {
				status: NEW_DOCUMENT_STATUS,
			}
		});

		dialogRef.afterClosed().pipe(
			take(1),
			switchMap((data) => {
				if (data){
					return this.documentService.addNewDocunent(data.status, data.file, data.name);
				}
				return EMPTY
			}),
			catchError((error) => {
				console.error('Error adding document:', error);
				return EMPTY;
			})
		).subscribe(() => {
			this.snackBar.open('The document was successfully added.', 'Close');
			this.fetchData()
		});
	}

	deleteDocument(id: string): void {
		this.documentService.deleteDocument(id).pipe(
			catchError((error) => {
				console.error('Error deleting document:', error);
				return EMPTY;
			})
		).subscribe(() => {
			this.snackBar.open('The document was successfully deleted.', 'Close');
			this.fetchData();
		})
	}

	changeDocumentStatus(id:string, event: MatRadioChange): void {
		this.documentService.shangeStatusDocument(id, event.value).pipe(
			catchError((error) => {
				console.error('Error change status document:', error);
				return EMPTY;
			})
		).subscribe((data) => {
			this.fetchData();
		})

	}

	rewokeReview(id:string): void {
		this.documentService.rewokeReview(id).pipe(
			catchError((error) => {
				console.error('Error revoke:', error);
				return EMPTY;
			})
		).subscribe ((data) => {
			this.fetchData();
		}) 
	}

	sendToReview(id:string): void{
		this.documentService.sendToReview(id).pipe(

		).subscribe ((data) => {
			this.fetchData();
		}) 
	}

	changeName(id: string, name: any): void {
		this.documentService.changeName(id, name).subscribe((a) => this.fetchData());
	}
	
	closeMenu(id: string, name: string): void {
		this.menuTriggers.forEach(trigger => trigger.closeMenu());
		this.changeName(id, name);
	}
}
