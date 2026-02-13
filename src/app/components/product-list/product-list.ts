import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SlugUtil } from '../../utils/slug.util';
import { Product } from '../../Models/product.model';
import { ProductService } from '../../Services/product.service';
import { ColorExtractorService } from '../../Services/ColorExtractorService';
import { ProductCardShimmer } from '../../shared/shimmer/product-card-shimmer/product-card-shimmer';

interface ProductWithColor extends Product {
  ambientColor?: string;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardShimmer],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css'],
})
export class ProductList implements OnInit {
  products: ProductWithColor[] = [];
  loading = true;

  constructor(
    private productService: ProductService,
    private router: Router,
    private colorExtractor: ColorExtractorService,
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  async loadProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe(async (products) => {
      this.products = products;
      console.log('products', products);

      // Extract colors for each product
      await this.extractProductColors();

      this.loading = false;
    });
  }

  /**
   * Extract ambient colors from all product images
   */
  private async extractProductColors() {
    const colorPromises = this.products.map(async (product) => {
      if (product.imageUrl && product.imageUrl.length > 0) {
        try {
          const dominantColor = await this.colorExtractor.extractDominantColor(product.imageUrl[0]);
          product.ambientColor = this.colorExtractor.createAmbientColor(
            dominantColor,
            0.2, // Adjust opacity here (0.1 - 0.3 works well)
          );
        } catch (error) {
          console.error('Error extracting color for product:', product.title, error);
          product.ambientColor = 'rgba(240, 240, 240, 0.15)'; // Fallback
        }
      }
    });

    await Promise.all(colorPromises);
  }

  isNewProduct(product: any): boolean {
    if (!product.createdAt) return false;

    // Convert Firestore Timestamp to JavaScript Date
    const createdAtDate = product.createdAt.toDate();
    const now = new Date();

    // Calculate difference in milliseconds
    const diffMs = now.getTime() - createdAtDate.getTime();

    // Convert to hours and check if less than 24
    const diffHours = diffMs / (1000 * 60 * 60);

    return diffHours < 24;
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
