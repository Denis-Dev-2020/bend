import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProductsdataService {
  private productsSubject = new BehaviorSubject<any[]>([]);

  private products = [
    { ID: '10000', Name: 'Bag', Image: 'https://contents.mediadecathlon.com/p2245849/k$e644427d182ab703a9b9e6ddf4bdb8c8/20l-bag-essential-blue.jpg', Description: 'This is a bag of 20L', Price: 144, CreationDate: '04-29-2024' },
    { ID: '10001', Name: 'Shoes', Image: 'https://nextsneakers.co.il/wp-content/uploads/2023/03/f67c3da9a8e2de26b8f5a9b62ceeb8bc-1.jpg', Description: 'Comfortable running shoes', Price: 89, CreationDate: '05-01-2024' },
    { ID: '10002', Name: 'Watch', Image: 'https://www.padani.com/pub/media/catalog/product/cache/image/e9c3970ab036de70892d86c6d221abfe/w/g/wgpn0009_1.jpg', Description: 'Smartwatch with multiple features', Price: 199, CreationDate: '05-05-2024' },
    { ID: '10003', Name: 'Sunglasses', Image: 'https://optistore.net/media/com_product/product/DRX-2030-F-BLK-12K-59-Z.jpg', Description: 'Stylish sunglasses', Price: 59, CreationDate: '05-10-2024' },
    { ID: '10004', Name: 'Backpack', Image: 'https://d3m9l0v76dty0.cloudfront.net/system/photos/11579747/original/22a7b8af385a93cf16e242033f7e8a1f.jpg', Description: 'Durable backpack', Price: 75, CreationDate: '05-15-2024' },
    { ID: '10005', Name: 'Laptop', Image: 'https://d3m9l0v76dty0.cloudfront.net/system/photos/11616353/large/285e37364b4ac1234135dd0f91d8730e.jpg', Description: 'High-performance laptop', Price: 1200, CreationDate: '05-20-2024' },
    { ID: '10006', Name: 'Headphones', Image: 'https://tres.co.il/cdn/shop/products/utopia.jpg', Description: 'Noise-cancelling headphones', Price: 250, CreationDate: '05-25-2024' },
    { ID: '10007', Name: 'Camera', Image: 'https://gvanimstudiosh.com/Cat_497671_511.jpg', Description: 'Digital camera', Price: 450, CreationDate: '05-30-2024' },
    { ID: '10008', Name: 'Smartphone', Image: 'https://mobiledeal.co.il/wp-content/uploads/2024/03/b_1.jpg', Description: 'Latest smartphone model', Price: 999, CreationDate: '06-05-2024' },
    { ID: '10009', Name: 'Tablet', Image: 'https://buyiphone.co.il/wp-content/uploads/2022/10/iPad-Pro-11-inch-M2-2022%D7%90%D7%A4%D7%95%D7%A8-.jpeg', Description: 'Portable tablet', Price: 350, CreationDate: '06-10-2024' },
    { ID: '10010', Name: 'Printer', Image: 'https://www.offix.co.il/wp-content/uploads/2023/03/HP-DesignJet-Z9-PostScript-Printer.png', Description: 'Wireless printer', Price: 120, CreationDate: '06-15-2024' },
    { ID: '10011', Name: 'Monitor', Image: 'https://img.ksp.co.il/item/269673/b_1.jpg', Description: '4K monitor', Price: 300, CreationDate: '06-20-2024' },
    { ID: '10012', Name: 'Keyboard', Image: 'https://www.nayadnayad.co.il/UploadImages/612516_proxk.jpg', Description: 'Mechanical keyboard', Price: 100, CreationDate: '06-25-2024' },
    { ID: '10013', Name: 'Mouse', Image: 'https://goldtop.co.il/upload_files/3DConnexion%203DX-700040%20SpaceMouse%20Pro%203D%20USB%20FRONT.png', Description: 'Wireless mouse', Price: 50, CreationDate: '06-30-2024' },
    { ID: '10014', Name: 'Speaker', Image: 'https://tres.co.il/cdn/shop/products/Web-Ready-Reference-R-605FA-Hero-Pair-Grille-Off-scaled.jpg', Description: 'Bluetooth speaker', Price: 80, CreationDate: '07-05-2024' }
  ];


  constructor() { }

  getProducts() {
    return this.products;
  }

  getProductById(id: string) {
    return this.products.find(product => product.ID === id);
  }

  // updateProduct(updatedProduct: any) {
  //   const index = this.products.findIndex(product => product.ID === updatedProduct.ID);
  //   if (index !== -1) {
  //     this.products[index] = updatedProduct;
  //   }
  // }
  
  updateProduct(updatedProduct: any) {
    // Update your product list or database here
    const index = this.products.findIndex(p => p.ID === updatedProduct.ID);
    if (index !== -1) {
      this.products[index] = updatedProduct;
      this.productsSubject.next([...this.products]); // Notify subscribers
    }
  }


}
