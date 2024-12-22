import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalModule, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { ServiceService } from './services/service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgbModalModule, HttpClientModule, CommonModule, FormsModule],
  providers: [ServiceService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'caplinq-local';
  list: any;
  selectedItem: any = null;
  products: any[] = [];
  private currentModal: NgbModalRef | null = null;
  private previousModal: NgbModalRef | null = null;
  private modalContent: any;
  selectedProduct: any = null;
  searchTerm: string = '';
  filteredList: any;
  filteredProducts: any;
  isCheckboxChecked: boolean = false;
  selectedProducts: any[] = [];
  hoveredProduct: any = null;

  @ViewChild('selectedList') selectedList?: TemplateRef<any>;
  @ViewChild('newModalContent') newModalContent?: TemplateRef<any>;

  constructor(
    private modalService: NgbModal,
    private service: ServiceService
  ) {
    this.service.getSuppliers().subscribe((res: any) => {
      console.log('res', res);
      this.list = res;
      this.filteredList = [...this.list];
    });
    this.modalContent = null;
  }

  onHover(product: any | null) {
    this.hoveredProduct = product;
  }

  deleteProduct(product: any) {
    this.selectedProducts = this.selectedProducts.filter(p => p !== product);
  
    console.log(`${product.name} deleted`);
  
    if (this.selectedProducts.length === 0) {
      this.goBackToNewModal();
    }
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
    this.modalContent = content;
    this.currentModal = this.modalService.open(content);
  }

  resetSearch() {
    this.searchTerm = '';
    this.filteredList = [...this.list];
    this.filteredProducts = [...this.products];
  }

  openNewModal(newContent: any, item: any) {
    this.currentModal?.dismiss();
  
    this.selectedItem = item;
    console.log('Selected Item:', item);
    this.searchTerm = '';
  
    this.service.getProductsBySupplierId(item.id).subscribe((res: any) => {
      console.log('Products for supplier:', res);
      this.products = res.data.map((product: any) => ({
        ...product,
        isExpanded: false,
      }));
      this.filteredProducts = [...this.products];
    });
  
    this.previousModal = this.currentModal;
    this.currentModal = this.modalService.open(newContent);
  }

  filterProducts() {
    this.filteredProducts = this.products.map(product => {
      const matchesProductName = product.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const filteredChildProducts = product.childProducts.filter((child: any) =>
        child.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        child.sku.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
  
      const isExpanded = this.searchTerm !== '' && (matchesProductName || filteredChildProducts.length > 0);
  
      if (matchesProductName) {
        return {
          ...product,
          isExpanded: isExpanded,
          childProducts: product.childProducts,
        };
      }
  
      if (filteredChildProducts.length > 0) {
        return {
          ...product,
          isExpanded: isExpanded,
          childProducts: filteredChildProducts,
        };
      }
  
      return null;
    }).filter(product => product !== null);
  
    console.log('search', this.searchTerm, this.filteredProducts);
  }  

  onCheckboxChange(childProduct: any, event: Event): void {
    childProduct.isChecked = (event.target as HTMLInputElement).checked;
  
    if (childProduct.isChecked) {
      this.selectedProducts.push(childProduct);
    } else {
      this.selectedProducts = this.selectedProducts.filter(
        (product) => product !== childProduct
      );
    }
  
    this.updateCheckboxState();
    console.log(`${childProduct.name} is checked: ${childProduct.isChecked}`);
  }

  updateCheckboxState(): void {
    this.isCheckboxChecked = this.products.some(product =>
      product.childProducts.some((child: any) => child.isChecked)
    );
  }

  get isAnyCheckboxChecked(): boolean {
    return this.products.some(product =>
      product.childProducts.some((child: any) => child.isChecked)
    );
  }

  getSelectedProductsCount(): number {
    return this.products.reduce((count, product) => {
      const selectedChildren = product.childProducts.filter((child: any) => child.isChecked);
      return count + selectedChildren.length;
    }, 0);
  }

  handleConfirm() {
    if (this.isAnyCheckboxChecked) {
      this.currentModal?.close();
      this.openSelectedListModal();
    }
  }
  
  openSelectedListModal() {
    this.previousModal = this.currentModal;
    this.currentModal = this.modalService.open(this.selectedList, { size: 'lg' });
  }  
  
  toggleChildProducts(product: any) {
    product.isExpanded = !product.isExpanded;
    this.selectedProduct = product;
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
      return text;
    }
  
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  }  

  resetSelectedProduct() {
    this.selectedProduct = null;
  }

  goBackToPreviousModal() {
    this.resetSearch();
    this.currentModal?.dismiss();

    if (this.modalContent) {
      this.currentModal = this.modalService.open(this.modalContent); // Reopen the first modal
    }
  }

  goBackToNewModal() {
    this.currentModal?.dismiss();
    if (this.newModalContent) {
      this.currentModal = this.modalService.open(this.newModalContent);
    } else {
      console.error("newModalContent is not initialized.");
    }
  }  
  
}