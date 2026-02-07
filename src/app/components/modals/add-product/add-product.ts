import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Product } from '../../../Models/product.model';
import { ProductService } from '../../../Services/product.service';
import { ToastService } from '../../../Services/toast.service';
import { environment } from '../../../Environment/environment';

export interface DialogData {
  product?: Product;
  editMode: boolean;
}

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './add-product.html',
  styleUrls: ['./add-product.css'],
})
export class AddProduct implements OnInit {
  productForm: FormGroup;
  editMode = false;
  uploading = false;
  uploadError = '';
  saving = false;
  uploadedImages: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddProduct>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private productService: ProductService,
    private http: HttpClient,
    private toast: ToastService,
    private fb: FormBuilder,
  ) {
    // Initialize form with validators
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0.01)]],
      description: [''],
      imageUrl: [[]],
    });
  }

  ngOnInit() {
    if (this.data) {
      this.editMode = this.data.editMode;

      if (this.data.product) {
        // Patch form with existing product data
        this.productForm.patchValue({
          title: this.data.product.title,
          price: this.data.product.price,
          description: this.data.product.description,
          imageUrl: this.data.product.imageUrl || [],
        });
        this.uploadedImages = [...(this.data.product.imageUrl || [])];
      }
    }
  }

  async onImageUpload(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    this.uploading = true;
    this.uploadError = '';

    // Disable form controls during upload
    this.productForm.get('title')?.disable();
    this.productForm.get('price')?.disable();
    this.productForm.get('description')?.disable();

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

        this.uploadedImages = [...this.uploadedImages, uploadResponse.secure_url];
        this.productForm.patchValue({ imageUrl: this.uploadedImages });
      }
    } catch (error: any) {
      this.uploadError = error.message || 'Failed to upload images. Please try again.';
      console.error('Upload error:', error);
    } finally {
      this.uploading = false;
      // Re-enable form controls
      this.productForm.get('title')?.enable();
      this.productForm.get('price')?.enable();
      this.productForm.get('description')?.enable();
      event.target.value = '';
    }
  }

  async onSubmit() {
    if (this.productForm.invalid) {
      this.toast.warning('Please fill all required fields');
      return;
    }

    if (!this.uploadedImages.length) {
      this.toast.warning('Please upload at least one image');
      return;
    }

    this.saving = true;
    // Disable entire form during save
    this.productForm.disable();

    try {
      const formValue = {
        ...this.productForm.getRawValue(), // Use getRawValue() to get disabled fields too
        imageUrl: this.uploadedImages,
      };

      if (this.editMode && this.data.product?.id) {
        await this.productService.updateProduct(this.data.product.id, formValue);
        this.toast.success('Product updated successfully!');
      } else {
        await this.productService.addProduct(formValue);
        this.toast.success('Product added successfully!');
      }

      this.dialogRef.close(true);
    } catch (error) {
      console.error('Error saving product:', error);
      this.toast.error('Failed to save product. Please try again.');
      this.saving = false;
      // Re-enable form on error
      this.productForm.enable();
    }
  }
  removeImage(index: number) {
    this.uploadedImages.splice(index, 1);
    this.productForm.patchValue({ imageUrl: this.uploadedImages });
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  // Getters for template convenience
  get title() {
    return this.productForm.get('title');
  }

  get price() {
    return this.productForm.get('price');
  }

  get description() {
    return this.productForm.get('description');
  }
}
