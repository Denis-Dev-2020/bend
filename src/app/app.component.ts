import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ProductsmainComponent } from './components/products/productsmain/productsmain.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ProductsmainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'CodeValue';
}
