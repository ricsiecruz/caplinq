import { Component } from '@angular/core';
import { NgbModal, NgbModalModule, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { ServiceService } from './services/service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgbModalModule, HttpClientModule, CommonModule, FormsModule], // Import HttpClientModule here
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
  selectedProduct: any = null;
  searchTerm: string = '';
  filteredList: any;

  constructor(
    private modalService: NgbModal,
    private service: ServiceService
  ) {
    this.service.getSuppliers().subscribe((res: any) => {
      console.log('res', res);
      this.list = res;
      this.filteredList = [...this.list];
    });
    this.modalContent = null; // Initialize the modalContent
  }

  filterList() {
    this.filteredList = this.list.filter((item: { name: string; }) =>
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
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
      // Initialize isExpanded for each product to false initially
      this.products = res.data.map((product: any) => ({
        ...product,
        isExpanded: false, // Initially, child products are hidden
      }));
    });
  
    this.previousModal = this.currentModal; // Store the current modal before opening the new one
    this.currentModal = this.modalService.open(newContent); // Open the new modal
  }
  
  toggleChildProducts(product: any) {
    // Toggle the isExpanded property
    product.isExpanded = !product.isExpanded;

    // Set the selected product
    this.selectedProduct = product.isExpanded ? product : null;
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