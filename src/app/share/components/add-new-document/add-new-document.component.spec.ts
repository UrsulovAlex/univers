import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewDocumentComponent } from './add-new-document.component';

describe('AddNewDocumentComponent', () => {
  let component: AddNewDocumentComponent;
  let fixture: ComponentFixture<AddNewDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewDocumentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
