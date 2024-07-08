// import { Component, Input, OnChanges, Output, EventEmitter, SimpleChanges } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { ProductsdataService } from '../../../services/data/productsdata.service';

// @Component({
//   selector: 'app-productdetail',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './productdetail.component.html',
//   styleUrls: ['./productdetail.component.css']
// })
// export class ProductdetailComponent implements OnChanges {
//   @Input() product: any;
//   @Output() productUpdated = new EventEmitter<void>();
//   editableProduct: any;
//   isEditing: boolean = false;

//   constructor(private productsDataService: ProductsdataService) { }

//   ngOnChanges(changes: SimpleChanges) {
//     if (changes['product'] && this.product) {
//       // Create a copy of the product to edit
//       this.editableProduct = { ...this.product };
//     }
//   }
//   enableEditing() {
//     this.isEditing = true;
//   }
//   saveProduct() {
//     this.productsDataService.updateProduct(this.editableProduct);
//     this.product = { ...this.editableProduct };
//     this.isEditing = false;
//     this.productUpdated.emit();
//   }
//   cancelEditing() {
//     this.editableProduct = { ...this.product };
//     this.isEditing = false;
//   }
// }







// src/app/components/products/productdetail/productdetail.component.ts

import { Component, Input, OnChanges, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductsdataService } from '../../../services/data/productsdata.service';

@Component({
  selector: 'app-productdetail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './productdetail.component.html',
  styleUrls: ['./productdetail.component.css']
})
export class ProductdetailComponent implements OnChanges {
  @Input() product: any;
  @Output() productUpdated = new EventEmitter<void>();
  editableProduct: any;
  isEditing: boolean = false;
  productForm: FormGroup; // Define FormGroup for reactive forms

  constructor(private formBuilder: FormBuilder, private productsDataService: ProductsdataService) {
    this.productForm = this.formBuilder.group({
      Name: ['', Validators.required],
      Image: [''],
      Description: [''],
      Price: ['', [Validators.required, Validators.min(0.01)]],
      CreationDate: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product'] && this.product) {
      this.editableProduct = { ...this.product };
      this.productForm.patchValue({
        Name: this.editableProduct.Name,
        Image: this.editableProduct.Image,
        Description: this.editableProduct.Description,
        Price: this.editableProduct.Price,
        CreationDate: this.editableProduct.CreationDate
      });
    }
  }

  enableEditing() {
    this.isEditing = true;
  }

  saveProduct() {
    if (this.productForm.valid) {
      this.editableProduct = { ...this.productForm.value }; // Update editableProduct from form values
      this.productsDataService.updateProduct(this.editableProduct); // Update product via service
      this.product = { ...this.editableProduct }; // Update product in parent component
      this.isEditing = false;
      this.productUpdated.emit();
    } else {
      this.markFormGroupTouched(this.productForm); // Mark all fields as touched to display validation messages
    }
  }

  cancelEditing() {
    this.isEditing = false;
    this.productForm.reset(this.editableProduct); // Reset form to original product values
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched(); // Mark each control as touched to trigger validation messages
    });
  }
}
