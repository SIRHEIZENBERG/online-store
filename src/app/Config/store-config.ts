// src/app/core/config/store-config.ts

export interface StoreConfig {
  storeName: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: [];
  };
  branding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    logo: string;
    favicon: string;
  };
  features: {
    categories: boolean;
    search: boolean;
    whatsappIntegration: boolean;
    showStock: boolean;
  };
  contactInfo: {
    phone: string;
    email: string;
    location: string;
    whatsapp: string;
  };
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  cloudinary: {
    cloudName: string;
    uploadPreset: string;
    folder: string;
  };
}

// ============================================
// CUSTOMIZE THIS FOR EACH CLIENT
// ============================================

export const storeConfig: StoreConfig = {
  storeName: 'My Store',

  branding: {
    primaryColor: '#2563eb',
    secondaryColor: '#1e293b',
    accentColor: '#f59e0b',
    logo: 'https://res.cloudinary.com/dff2vcjum/image/upload/v1/logo.png',
    favicon: '',
  },

  features: {
    categories: true,
    search: true,
    whatsappIntegration: true,
    showStock: true,
  },

  contactInfo: {
    phone: '+254712345678',
    email: 'info@store.com',
    location: 'Nairobi, Kenya',
    whatsapp: '+254712345678',
  },

  // Paste client's Firebase config here
  firebase: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'your-project.firebaseapp.com',
    projectId: 'your-project-id',
    storageBucket: 'your-project.appspot.com',
    messagingSenderId: '123456789',
    appId: '1:123456789:web:abc123',
  },

  cloudinary: {
    cloudName: 'dff2vcjum',
    uploadPreset: 'demo-store-uploads', // Create this in Cloudinary
    folder: 'client-store-name', // Change per client
  },
  seo: {
    metaDescription: '',
    metaTitle: '',
    keywords: [],
  },
};

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDyNieAKFZrUxL-wfr9tJ2UhNvnRr-aoEw',
  authDomain: 'online-store-framework.firebaseapp.com',
  databaseURL: 'https://online-store-framework-default-rtdb.firebaseio.com',
  projectId: 'online-store-framework',
  storageBucket: 'online-store-framework.firebasestorage.app',
  messagingSenderId: '985389293033',
  appId: '1:985389293033:web:32d78bf08272d8a4293f78',
  measurementId: 'G-G20HRPSFC8',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
