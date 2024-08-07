import { Component, ViewChild } from '@angular/core';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

import { ProductslistComponent } from '../productslist/productslist.component';
import { ProductdetailComponent } from '../productdetail/productdetail.component';
import { ProductaddComponent } from '../productadd/productadd.component';


@Component({
  selector: 'app-productsmain',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,ProductslistComponent,ProductdetailComponent,ProductaddComponent],
  templateUrl: './productsmain.component.html',
  styleUrl: './productsmain.component.css'
})
export class ProductsmainComponent {
  @ViewChild(ProductslistComponent) productsListComponent!: ProductslistComponent;
  selectedProduct: any;

  constructor() { }

  onProductSelected(product: any): void {
    this.selectedProduct = product;
  }
  refreshList() {
    this.productsListComponent.refreshList();
    this.selectedProduct = null;
  }

}
 