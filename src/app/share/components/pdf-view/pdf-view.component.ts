import { AfterViewInit, Component, inject } from '@angular/core';
import PSPDFKit from "pspdfkit";
import {MatDialogModule, MAT_DIALOG_DATA,} from '@angular/material/dialog';
import {MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-pdf-view',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './pdf-view.component.html',
  styleUrl: './pdf-view.component.scss'
})
export class PdfViewComponent implements AfterViewInit {
   	data = inject(MAT_DIALOG_DATA);

	ngAfterViewInit (): void {
		fetch(this.data.fileUrl)
			.then((response) => {
				if (!response.ok) {
					throw new Error("Fail download");
				}
				return response.arrayBuffer();
			})
			.then((arrayBuffer) => {
				PSPDFKit.load({
					container: "#pspdfkit-container",
					document: arrayBuffer,
					baseUrl: location.protocol + "//" + location.host + "/assets/",
		  	})
			.then((instance) => {
					console.log("PSPDFKit loaded", instance);
			})
			.catch((error) => {
				console.log(error.message);
			});
		})
		.catch((error) => {
		  	console.error("Error download:", error);
		});
	}
}
