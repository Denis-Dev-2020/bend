import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductsdataService } from '../../../services/data/productsdata.service';


@Component({
  selector: 'app-productslist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productslist.component.html',
  styleUrl: './productslist.component.css'
})
export class ProductslistComponent implements OnInit {
  @Output() productSelected = new EventEmitter<any>();
  products: any[] = [];
  paginatedProducts: any[] = [];
  currentPage: number = 1;
  productsPerPage: number = 5;
  totalPages: number = 0;
  sortField: string = 'Name'; // Default sort field

  constructor(private productsDataService: ProductsdataService) { }

  ngOnInit(): void {
    this.products = this.productsDataService.getProducts();
    this.sortProducts();
    this.totalPages = Math.ceil(this.products.length / this.productsPerPage);
    this.updatePagination();
  }

  refreshList() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.products = this.productsDataService.getProducts();
    this.sortProducts();
    this.updatePagination();
  }

  sortProducts(): void {
    this.products.sort((a, b) => {
      if (a[this.sortField] < b[this.sortField]) {
        return -1;
      }
      if (a[this.sortField] > b[this.sortField]) {
        return 1;
      }
      return 0;
    });
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.productsPerPage;
    const endIndex = startIndex + this.productsPerPage;
    this.paginatedProducts = this.products.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.updatePagination();
  }

  selectProduct(product: any): void {
    this.productSelected.emit(product);
  }

  onSortChange(event: any): void {
    this.sortField = event.target.value;
    this.sortProducts();
    this.updatePagination();
  }
}
