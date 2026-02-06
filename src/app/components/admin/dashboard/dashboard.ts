import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { Product } from '../../../Models/product.model';
import { ProductService } from '../../../Services/product.service';
import { AuthService } from '../../../Services/auth.service';
import { ToastService } from '../../../Services/toast.service';
import { SlugUtil } from '../../../utils/slug.util';

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
  itemsPerPage = 8;
  currentPage = 1;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService,
    private dialog: MatDialog, // ✅ THIS WAS MISSING
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.toast.success('Login successful!');
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => (this.products = products),
      error: () => this.toast.error('Failed to load products'),
    });
  }

  openAddForm() {
    const dialogRef = this.dialog.open(AddProduct, {
      width: '600px',
      disableClose: true,
      data: {
        editMode: false,
        product: {
          title: '',
          price: 0,
          description: '',
          imageUrl: [],
        },
      },
    });

    dialogRef.afterClosed().subscribe(async (result: Product | null) => {
      if (!result) return;

      await this.productService.addProduct(result);
      this.toast.success('Product added successfully!');
      this.loadProducts();
    });
  }

  openEditForm(product: Product) {
    if (!product.id) return;

    const dialogRef = this.dialog.open(AddProduct, {
      width: '600px',
      disableClose: true,
      data: {
        editMode: true,
        product: { ...product },
      },
    });

    dialogRef.afterClosed().subscribe(async (result: Product | null) => {
      if (!result) return;

      await this.productService.updateProduct(product.id!, result);
      this.toast.success('Product updated successfully!');
      this.loadProducts();
    });
  }

  viewProduct(product: Product) {
    if (!product.id) return;
    const slug = SlugUtil.generateSlug(product.title, product.id);
    this.router.navigate(['/product', slug]);
  }

  get paginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.products.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.products.length / this.itemsPerPage);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  async onDelete(id?: string) {
    if (!id) return;
    if (!confirm('Delete this product?')) return;

    await this.productService.deleteProduct(id);
    this.toast.success('Product deleted!');
    this.loadProducts();
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
