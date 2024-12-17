import { Component } from '@angular/core';
import { NgbModal, NgbModalModule, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { ServiceService } from './services/service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgbModalModule, HttpClientModule, CommonModule], // Import HttpClientModule here
  providers: [ServiceService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'caplinq-local';
  list: any;
  selectedItem: any = null; // Store the selected item data
  products: any[] = []; // Store the list of products for the selected supplier
  private currentModal: NgbModalRef | null = null; // Store the current modal instance
  private previousModal: NgbModalRef | null = null; // Store the previous modal instance
  private modalContent: any; // Store the content for the initial modal

  constructor(
    private modalService: NgbModal,
    private service: ServiceService
  ) {
    this.service.getSuppliers().subscribe((res: any) => {
      console.log('res', res);
      this.list = res;
    });
    this.modalContent = null; // Initialize the modalContent
  }

  open(content: any) {
    this.previousModal = this.currentModal; // Store the current modal before opening the new one
    this.modalContent = content; // Store the content of the first modal
    this.currentModal = this.modalService.open(content);
  }

  openNewModal(newContent: any, item: any) {
    // Safely dismiss the current modal if it exists
    this.currentModal?.dismiss(); // Using optional chaining to call dismiss() if currentModal is not null

    this.selectedItem = item; // Store the selected item's data
    console.log('Selected Item:', item);

    // Fetch products related to the selected supplier
    this.service.getProductsBySupplierId(item.id).subscribe((res: any) => {
      console.log('Products for supplier:', res);
      this.products = res.data; // Store the fetched products
    });

    this.previousModal = this.currentModal; // Store the current modal before opening the new one
    this.currentModal = this.modalService.open(newContent); // Open the new modal
  }

  goBackToPreviousModal() {
    // Dismiss the current modal safely
    this.currentModal?.dismiss();

    // Check if modalContent exists before reopening the original modal
    if (this.modalContent) {
      this.currentModal = this.modalService.open(this.modalContent); // Reopen the first modal
    }
  }
}