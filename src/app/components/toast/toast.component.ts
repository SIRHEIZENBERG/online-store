import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../Services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast toast-{{ toast.type }}" (click)="toastService.remove(toast.id)">
          <span class="toast-icon">{{ getIcon(toast.type) }}</span>
          <span class="toast-message">{{ toast.message }}</span>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .toast-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        pointer-events: none;
      }

      .toast {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 20px;
        margin-bottom: 10px;
        border-radius: 8px;
        color: white;
        cursor: pointer;
        min-width: 300px;
        max-width: 500px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        pointer-events: auto;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;

        /* CSS Animation */
        animation: slideIn 300ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }

      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      .toast:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      }

      .toast-icon {
        font-size: 20px;
        flex-shrink: 0;
      }

      .toast-message {
        flex: 1;
      }

      .toast-success {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      }

      .toast-error {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      }

      .toast-info {
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      }

      .toast-warning {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      }
    `,
  ],
})
export class ToastComponent {
  toastService = inject(ToastService);

  getIcon(type: string): string {
    const icons = {
      success: '✓',
      error: '✕',
      info: 'ℹ',
      warning: '⚠',
    };
    return icons[type as keyof typeof icons] || 'ℹ';
  }
}
