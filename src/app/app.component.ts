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
  private currentModal: NgbModalRef | null = null; // Store the modal instance

  constructor(
    private modalService: NgbModal,
    private service: ServiceService
  ) {
    this.service.getSuppliers().subscribe((res: any) => {
      console.log('res', res);
      this.list = res;
    });
  }

  open(content: any) {
    this.currentModal = this.modalService.open(content);
  }

  openNewModal(newContent: any, item: any) {
    if (this.currentModal) {
      this.currentModal.dismiss(); // Close the current modal
    }

    console.log('Opening new modal for:', item.name);
    this.currentModal = this.modalService.open(newContent); // Open the new modal
  }
}