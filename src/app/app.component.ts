import { Component } from '@angular/core';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
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
    this.modalService.open(content);
  }
}
