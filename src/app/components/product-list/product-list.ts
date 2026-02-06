import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SlugUtil } from '../../utils/slug.util';
import { Product } from '../../Models/product.model';
import { ProductService } from '../../Services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css'],
})
export class ProductList implements OnInit {
  products: Product[] = [];
  loading = true;

  constructor(
    private productService: ProductService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
      this.loading = false;
    });
  }

  viewProduct(product: Product) {
    if (!product.id) return;
    const slug = SlugUtil.generateSlug(product.title, product.id);
    this.router.navigate(['/product', slug]);
  }

  contactVendor(product: Product, event?: Event) {
    // Prevent card click when clicking WhatsApp button
    if (event) {
      event.stopPropagation();
    }

    const message = `Hi, I'm interested in *${product.title}* (KES ${product.price})`;
    const encodedMessage = encodeURIComponent(message);

    // Replace with actual vendor phone number (format: 254XXXXXXXXX without +)
    const phoneNumber = '254712345678'; // UPDATE THIS WITH ACTUAL NUMBER

    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  }
}
