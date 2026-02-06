import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Product } from '../../../Models/product.model';
import { environment } from '../../../Environment/environment';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.html',
  styleUrls: ['./add-product.css'],
})
export class AddProduct {
  uploading = false;
  uploadError = '';

  constructor(
    private dialogRef: MatDialogRef<AddProduct>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      editMode: boolean;
      product: Product;
    },
  ) {
    // ✅ GUARANTEE product exists (fixes "possibly undefined")
    this.data.product ??= {
      title: '',
      price: 0,
      description: '',
      imageUrl: [],
    };

    this.data.product.imageUrl ??= [];
  }

  /* ================= IMAGE UPLOAD ================= */

  async onImageUpload(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.uploading = true;
    this.uploadError = '';

    try {
      for (const file of Array.from(input.files)) {
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} is not an image`);
        }

        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} exceeds 5MB`);
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', environment.cloudinary.uploadPreset);

        const res = await firstValueFrom(
          this.http.post<any>(
            `https://api.cloudinary.com/v1_1/${environment.cloudinary.cloudName}/image/upload`,
            formData,
          ),
        );

        this.data.product.imageUrl.push(res.secure_url);
      }
    } catch (err: any) {
      console.error(err);
      this.uploadError = err?.message || 'Failed to upload images. Please try again.';
    } finally {
      this.uploading = false;
      input.value = '';
    }
  }

  /* ================= IMAGE REMOVE ================= */

  removeImage(index: number): void {
    this.data.product.imageUrl.splice(index, 1);
  }

  /* ================= ACTIONS ================= */

  submit(): void {
    if (!this.data.product.title || this.data.product.price <= 0) return;
    this.dialogRef.close(this.data.product);
  }

  close(): void {
    this.dialogRef.close(null);
  }
}
