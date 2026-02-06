import { Injectable, inject, runInInjectionContext, Injector } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  docData,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from '../Models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly firestore = inject(Firestore);
  private readonly injector = inject(Injector);

  // Get all products
  getProducts(): Observable<Product[]> {
    return runInInjectionContext(this.injector, () => {
      const productsCollection = collection(this.firestore, 'products');
      return collectionData(productsCollection, { idField: 'id' }) as Observable<Product[]>;
    });
  }

  // Get single product
  getProduct(id: string): Observable<Product> {
    return runInInjectionContext(this.injector, () => {
      const productDoc = doc(this.firestore, `products/${id}`);
      return docData(productDoc, { idField: 'id' }) as Observable<Product>;
    });
  }

  // Add product
  async addProduct(product: Product): Promise<void> {
    return runInInjectionContext(this.injector, async () => {
      const productsCollection = collection(this.firestore, 'products');
      await addDoc(productsCollection, {
        ...product,
        createdAt: new Date(),
      });
    });
  }

  // Update product
  async updateProduct(id: string, product: Partial<Product>): Promise<void> {
    return runInInjectionContext(this.injector, async () => {
      const productDoc = doc(this.firestore, `products/${id}`);
      await updateDoc(productDoc, product);
    });
  }

  // Delete product
  async deleteProduct(id: string): Promise<void> {
    return runInInjectionContext(this.injector, async () => {
      const productDoc = doc(this.firestore, `products/${id}`);
      await deleteDoc(productDoc);
    });
  }
}
