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
    private http: HttpClient,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.toast.success('Login successful!');
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

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  openAddForm() {
    this.showForm = true;
    this.editMode = false;
    this.resetForm();
  }

  viewProduct(product: Product) {
    if (!product.id) return;
    const slug = SlugUtil.generateSlug(product.title, product.id);
    this.router.navigate(['/product', slug]);
  }

  openEditForm(product: Product) {
    this.showForm = true;
    this.editMode = true;
    this.currentProductId = product.id || null;
    this.product = { ...product };
  }

  resetForm() {
    this.product = {
      title: '',
      price: 0,
      description: '',
      imageUrl: [],
    };
    this.currentProductId = null;
    this.uploadError = '';
  }

  closeForm() {
    this.showForm = false;
    this.resetForm();
  }

  async onImageUpload(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    this.uploading = true;
    this.uploadError = '';

    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} is not an image file`);
        }

        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} exceeds 5MB limit`);
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', environment.cloudinary.uploadPreset);

        const uploadResponse = await firstValueFrom(
          this.http.post<any>(
            `https://api.cloudinary.com/v1_1/${environment.cloudinary.cloudName}/image/upload`,
            formData,
          ),
        );

        this.product.imageUrl = [...this.product.imageUrl, uploadResponse.secure_url];
      }
    } catch (error: any) {
      this.uploadError = error.message || 'Failed to upload images. Please try again.';
      console.error('Upload error:', error);
    } finally {
      this.uploading = false;
      event.target.value = '';
    }
  }

  removeImage(index: number) {
    this.product.imageUrl.splice(index, 1);
  }

  async onSubmit() {
    if (!this.product.title || !this.product.imageUrl || this.product.price <= 0) {
      this.toast.warning('Please fill all required fields');
      return;
    }

    try {
      if (this.editMode && this.currentProductId) {
        await this.productService.updateProduct(this.currentProductId, this.product);
        this.toast.success('Product updated successfully!');
      } else {
        await this.productService.addProduct(this.product);
        this.toast.success('Product added successfully!');
      }

      this.closeForm();
    } catch (error) {
      console.error('Error saving product:', error);
      this.toast.error('Failed to save product. Please try again.');
    }
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
