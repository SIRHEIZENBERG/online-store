import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SlugUtil } from '../../utils/slug.util';
import { Product } from '../../Models/product.model';
import { ProductService } from '../../Services/product.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css'],
})
export class ProductDetail implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  product: Product | null = null;
  loading = true;
  error = false;
  currentUrl = '';
  currentImageIndex = 0;
  private scrollTimeout: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
  ) {}

  ngOnInit() {
    this.currentUrl = window.location.href;
    this.loadProduct();
  }

  nextImage() {
    if (this.currentImageIndex < (this.product?.imageUrl?.length ?? 0) - 1) {
      this.currentImageIndex++;
      this.scrollToImage(this.currentImageIndex);
    }
  }

  previousImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.scrollToImage(this.currentImageIndex);
    }
  }

  scrollToImage(index: number) {
    if (!this.scrollContainer) return;

    const container = this.scrollContainer.nativeElement;
    const scrollWidth = container.offsetWidth;

    container.scrollTo({
      left: scrollWidth * index,
      behavior: 'smooth',
    });

    this.currentImageIndex = index;
  }

  onScroll(event: any) {
    // Clear existing timeout
    clearTimeout(this.scrollTimeout);

    // Set new timeout to update index after scrolling stops
    this.scrollTimeout = setTimeout(() => {
      const container = event.target;
      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.offsetWidth;

      // Calculate which image is currently visible
      const newIndex = Math.round(scrollLeft / scrollWidth);

      if (
        newIndex !== this.currentImageIndex &&
        newIndex >= 0 &&
        newIndex < (this.product?.imageUrl?.length ?? 0)
      ) {
        this.currentImageIndex = newIndex;
      }
    }, 100);
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;

    if (!img.src.includes('not-found.png')) {
      img.src = 'assets/not-found.png';
    }
  }

  ngOnDestroy() {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
  }

  loadProduct() {
    const slug = this.route.snapshot.paramMap.get('slug');

    if (!slug) {
      this.error = true;
      this.loading = false;
      return;
    }

    // First, get all products to find the matching ID
    this.productService.getProducts().subscribe({
      next: (products) => {
        const productId = SlugUtil.findProductId(slug, products);

        if (productId) {
          // Now fetch the specific product
          this.productService.getProduct(productId).subscribe({
            next: (product) => {
              this.product = product;
              this.loading = false;
            },
            error: () => {
              this.error = true;
              this.loading = false;
            },
          });
        } else {
          this.error = true;
          this.loading = false;
        }
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  contactVendor() {
    if (!this.product) return;

    const message = `Hi, I'm interested in *${this.product.title}* (KES ${this.product.price})%0A%0ALink: ${this.currentUrl}`;
    const encodedMessage = encodeURIComponent(message);

    const phoneNumber = '254712345678'; // UPDATE THIS

    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  }

  copyLink() {
    navigator.clipboard.writeText(this.currentUrl).then(() => {
      alert('Link copied to clipboard!');
    });
  }

  shareProduct() {
    if (navigator.share) {
      navigator
        .share({
          title: this.product?.title || 'Product',
          text: `Check out ${this.product?.title} - KES ${this.product?.price}`,
          url: this.currentUrl,
        })
        .catch((err) => console.log('Error sharing:', err));
    } else {
      this.copyLink();
    }
  }

  goBack() {
    this.router.navigate(['/']);
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
