import { Component, inject, signal } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule, NgForm } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule, MAT_DIALOG_DATA, MatDialogRef,} from '@angular/material/dialog';
import {MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-add-new-document',
  imports: [MatInputModule, MatSelectModule, MatFormFieldModule, MatDialogModule, MatButtonModule, FormsModule],
  templateUrl: './add-new-document.component.html',
  styleUrl: './add-new-document.component.scss'
})
export class AddNewDocumentComponent {
    readonly data = inject(MAT_DIALOG_DATA);
    readonly dialogRef = inject(MatDialogRef<AddNewDocumentComponent>);

    formData = signal({
        name: '',
        status: '',
        file: null as unknown as File,
    });

    onFileSelected (event: Event): void {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0){
			const file = input.files[0];
            this.formData.update(value => ({ ...value, name: file.name }));
            this.formData.update(value => ({ ...value, file: file }));
		}
	}

    onChageFileName() {
        this.formData.update(value => ({ ...value, file: new File([value.file], value.name, { type: 'application/pdf' })}));
    }

    onSubmit(form: NgForm) {
        this.dialogRef.close(this.formData())
    }
}
