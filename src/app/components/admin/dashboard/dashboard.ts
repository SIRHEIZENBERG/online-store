import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from '../../../Models/product.model';
import { AuthService } from '../../../Services/auth.service';
import { ProductService } from '../../../Services/product.service';
import { environment } from '../../../Environment/environment';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '../../../Services/toast.service';
import { SlugUtil } from '../../../utils/slug.util';
import { MatDialog } from '@angular/material/dialog';
import { AddProduct } from '../../modals/add-product/add-product';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit {
  products: Product[] = [];
  paginatedProducts: Product[] = [];
  showForm = false;
  editMode = false;
  currentProductId: string | null = null;
  product: Product = {
    title: '',
    price: 0,
    description: '',
    imageUrl: [],
  };
  uploading = false;
  uploadError = '';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.toast.success('Login successful!');
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;

    if (!img.src.includes('not-found.png')) {
      img.src = 'assets/not-found.png';
    }
  }

  loadProducts() {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
      this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
      this.updatePaginatedProducts();
    });
  }

  updatePaginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.products.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedProducts();
    }
  }

  viewProduct(product: Product) {
    if (!product.id) return;
    const slug = SlugUtil.generateSlug(product.title, product.id);
    this.router.navigate(['/product', slug]);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  openAddForm() {
    const dialogRef = this.dialog.open(AddProduct, {
      minWidth: '100%',
      minHeight: '100vh',
      data: { editMode: false },
      disableClose: false,
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Product was added/updated successfully
        // No need to do anything, the service will handle updates
      }
    });
  }

  openEditForm(product: Product) {
    const dialogRef = this.dialog.open(AddProduct, {
      minWidth: '100%',
      minHeight: '100vh',
      data: {
        product: product,
        editMode: true,
      },
      disableClose: false,
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Product was updated successfully
      }
    });
  }

  async onDelete(id: string | undefined) {
    if (!id) return;

    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await this.productService.deleteProduct(id);
        this.toast.success('Product deleted successfully!');
      } catch (error) {
        console.error('Error deleting product:', error);
        this.toast.error('Failed to delete product. Please try again.');
      }
    }
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
