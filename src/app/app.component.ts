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
  filteredProducts: any;

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

  shouldHighlightProduct(product: any): boolean {
    return product.childProducts.some((childProduct: any) =>
      childProduct.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      childProduct.sku.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  filterList() {
    this.filteredList = this.list.filter((item: { name: string; }) =>
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  open(content: any) {
    this.resetSearch();
    this.previousModal = this.currentModal; // Store the current modal before opening the new one
    this.modalContent = content; // Store the content of the first modal
    this.currentModal = this.modalService.open(content);
  }

  resetSearch() {
    this.searchTerm = '';
    this.filteredList = [...this.list]; // Reset to full suppliers list
    this.filteredProducts = [...this.products]; // Reset to full products list
  }

  openNewModal(newContent: any, item: any) {
    // Safely dismiss the current modal if it exists
    this.currentModal?.dismiss(); // Using optional chaining to call dismiss() if currentModal is not null
  
    this.selectedItem = item; // Store the selected item's data
    console.log('Selected Item:', item);
    this.searchTerm = '';
  
    // Fetch products related to the selected supplier
    this.service.getProductsBySupplierId(item.id).subscribe((res: any) => {
      console.log('Products for supplier:', res);
      // Initialize isExpanded for each product to false initially
      this.products = res.data.map((product: any) => ({
        ...product,
        isExpanded: false, // Initially, child products are hidden
      }));
      this.filteredProducts = [...this.products];
    });
  
    this.previousModal = this.currentModal; // Store the current modal before opening the new one
    this.currentModal = this.modalService.open(newContent); // Open the new modal
  }

  filterProducts() {
    this.filteredProducts = this.products.map(product => {
      const matchesProductName = product.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const filteredChildProducts = product.childProducts.filter((child: any) =>
        child.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        child.sku.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
  
      // Set isExpanded based on the search term
      const isExpanded = this.searchTerm !== '' && (matchesProductName || filteredChildProducts.length > 0);
  
      if (matchesProductName) {
        return {
          ...product,
          isExpanded: isExpanded,  // Set isExpanded based on search term
          childProducts: product.childProducts,
        };
      }
  
      if (filteredChildProducts.length > 0) {
        return {
          ...product,
          isExpanded: isExpanded,  // Set isExpanded based on search term
          childProducts: filteredChildProducts,
        };
      }
  
      // Return null if no matches and no filtered child products
      return null;
    }).filter(product => product !== null);
  
    console.log('search', this.searchTerm, this.filteredProducts);
  }  

  onCheckboxChange(childProduct: any, event: Event): void {
    childProduct.isChecked = (event.target as HTMLInputElement).checked;
    console.log(`${childProduct.name} is checked: ${childProduct.isChecked}`);
  }  
  
  toggleChildProducts(product: any) {
    product.isExpanded = !product.isExpanded;
    this.selectedProduct = product; // Highlight the selected product
  }

  isRedBackground(product: any): boolean {
    return (
      product === this.selectedProduct || 
      this.isChildProductSelected(product.childProducts) ||
      product.childProducts.some((child: any) =>
        child.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        child.sku.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
  }

  isHighlight(product: any): boolean {
    return product === this.selectedProduct || this.isChildProductSelected(product.childProducts);
  }

  isHighlightSearch(product: any): boolean {
    return product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
      product.childProducts.some((child: any) =>
        child.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        child.sku.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
  }

  isChildProductSelected(childProducts: any[]): boolean {
    return childProducts.some((child) => child === this.selectedProduct);
  }  

  highlightText(text: string, searchTerm: string): string {
    if (!searchTerm) {
      return text; // Return the original text if no search term is provided
    }
  
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  }  

  // Function to reset the selected product when navigating back
  resetSelectedProduct() {
    this.selectedProduct = null;
  }

  goBackToPreviousModal() {
    this.resetSearch();
    // Dismiss the current modal safely
    this.currentModal?.dismiss();

    // Check if modalContent exists before reopening the original modal
    if (this.modalContent) {
      this.currentModal = this.modalService.open(this.modalContent); // Reopen the first modal
    }
  }
}