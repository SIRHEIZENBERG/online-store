import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-product-card-shimmer',
  standalone: true,
  imports: [CommonModule, NgxSkeletonLoaderModule],
  templateUrl: './product-card-shimmer.html',
  styleUrl: './product-card-shimmer.css',
})
export class ProductCardShimmer {
  // Array for ngFor loop - shows 6 skeleton cards
  skeletonCards = Array(6).fill(0);
}
