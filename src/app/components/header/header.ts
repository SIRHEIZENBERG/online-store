import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../Services/product.service';
import { AuthService } from '../../Services/auth.service';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  isMobileMenuOpen = false;
  private productService = inject(ProductService);
  private hasSeeded = false;
  user$: Observable<User | null>;

  constructor(
    private router: Router,
    public authService: AuthService,
  ) {
    // ✅ Assign it here
    this.user$ = this.authService.user$;
  }

  async ngOnInit() {
    // Check if we've already seeded (using localStorage to prevent re-seeding on refresh)
    if (!localStorage.getItem('products_seeded')) {
      await this.seedProducts();
      localStorage.setItem('products_seeded', 'true');
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

  private async seedProducts() {
    const products = [
      {
        title: 'Classic White Oxford Shirt',
        description:
          'Timeless button-down oxford shirt crafted from premium cotton. Features a regular fit, button-down collar, and chest pocket. Perfect for both casual and formal occasions.',
        imageUrl: [
          'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800',
          'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800',
        ],
        price: 28000,
      },
      {
        title: 'Vintage Denim Jacket',
        description:
          'Authentic vintage-wash denim jacket with classic trucker styling. Features button closure, chest pockets, and adjustable waist tabs. Made from durable 100% cotton denim that gets better with age.',
        imageUrl: [
          'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
          'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800',
          'https://images.unsplash.com/photo-1601333144130-8cbb312386b6?w=800',
        ],
        price: 65000,
      },
      {
        title: 'Slim Fit Dark Wash Jeans',
        description:
          'Modern slim-fit jeans in dark indigo wash. Crafted from stretch denim for comfort and mobility. Features five-pocket styling and subtle fading for a lived-in look.',
        imageUrl: [
          'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
          'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800',
        ],
        price: 55000,
      },
      {
        title: 'Merino Wool Crewneck Sweater',
        description:
          'Luxurious crewneck sweater knitted from 100% merino wool. Soft, breathable, and naturally temperature-regulating. Perfect layering piece for transitional weather.',
        imageUrl: [
          'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800',
          'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800',
        ],
        price: 72000,
      },
      {
        title: 'Floral Summer Midi Dress',
        description:
          'Breezy midi-length dress featuring a vibrant floral print. Made from lightweight cotton blend with a flattering A-line silhouette. Includes adjustable shoulder straps and side pockets.',
        imageUrl: [
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
          'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800',
        ],
        price: 48000,
      },
      {
        title: 'Black Leather Biker Jacket',
        description:
          'Premium genuine leather motorcycle jacket with asymmetric zip closure. Features quilted shoulder panels, multiple pockets, and belt details. Fully lined for comfort.',
        imageUrl: [
          'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
          'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800',
          'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=800',
        ],
        price: 185000,
      },
      {
        title: 'Essential Cotton T-Shirt Pack',
        description:
          'Set of three premium cotton t-shirts in neutral colors (white, black, grey). Soft jersey fabric with reinforced crew neck. Pre-shrunk and holds shape after washing.',
        imageUrl: [
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
          'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800',
        ],
        price: 35000,
      },
      {
        title: 'Tailored Wool Blazer',
        description:
          'Sharp single-breasted blazer in Italian wool blend. Features notch lapels, two-button closure, and functional sleeve buttons. Fully lined with inside pockets. Perfect for professional settings.',
        imageUrl: [
          'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800',
          'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800',
        ],
        price: 145000,
      },
      {
        title: 'Linen Beach Shorts',
        description:
          'Lightweight linen shorts perfect for warm weather. Features elastic waistband with drawstring, side pockets, and relaxed fit. Breathable fabric keeps you cool all day.',
        imageUrl: [
          'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800',
          'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800',
        ],
        price: 32000,
      },
      {
        title: 'Cashmere V-Neck Cardigan',
        description:
          'Luxuriously soft cardigan crafted from 100% cashmere. Features ribbed trim, mother-of-pearl buttons, and two front pockets. An investment piece that lasts for years.',
        imageUrl: [
          'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800',
          'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800',
        ],
        price: 195000,
      },
      {
        title: 'High-Waisted Wide Leg Trousers',
        description:
          'Elegant wide-leg trousers with high waist and pleated front. Made from wrinkle-resistant fabric blend. Features side pockets and back welt pockets. Flattering silhouette for any body type.',
        imageUrl: [
          'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800',
          'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800',
        ],
        price: 58000,
      },
      {
        title: 'Striped Breton Top',
        description:
          'Classic French-inspired striped shirt in navy and white. Made from soft cotton jersey with boat neck and three-quarter sleeves. A timeless wardrobe staple.',
        imageUrl: [
          'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=800',
          'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=800',
        ],
        price: 38000,
      },
      {
        title: 'Quilted Puffer Jacket',
        description:
          'Insulated puffer jacket with diamond quilting pattern. Features water-resistant outer shell, zip pockets, and adjustable hood. Lightweight yet warm for winter weather.',
        imageUrl: [
          'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800',
          'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800',
          'https://images.unsplash.com/photo-1548126032-079b5e27f355?w=800',
        ],
        price: 98000,
      },
      {
        title: 'Silk Slip Dress',
        description:
          'Elegant slip dress in pure silk charmeuse. Features delicate spaghetti straps, bias-cut for beautiful drape, and midi length. Perfect for special occasions or dressed down with sneakers.',
        imageUrl: [
          'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800',
          'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800',
        ],
        price: 125000,
      },
      {
        title: 'Chino Cargo Pants',
        description:
          'Modern take on cargo pants in premium cotton twill. Features multiple utility pockets, tapered leg, and comfortable mid-rise waist. Available in versatile neutral tones.',
        imageUrl: [
          'https://images.unsplash.com/photo-1624378515195-6bbdb73dff1a?w=800',
          'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800',
        ],
        price: 62000,
      },
      {
        title: 'Flannel Check Shirt',
        description:
          'Cozy brushed flannel shirt in traditional check pattern. Made from soft cotton blend that gets softer with each wash. Features button-down collar and chest pocket.',
        imageUrl: [
          'https://images.unsplash.com/photo-1598032895397-b9372f6c1815?w=800',
          'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
        ],
        price: 42000,
      },
      {
        title: 'Pleated Tennis Skirt',
        description:
          'Athletic-inspired pleated mini skirt with built-in shorts. Made from moisture-wicking fabric with stretchy waistband. Perfect for sports or casual streetwear styling.',
        imageUrl: [
          'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800',
          'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800',
        ],
        price: 36000,
      },
      {
        title: 'Oversized Hoodie',
        description:
          'Relaxed-fit hoodie in heavyweight cotton fleece. Features kangaroo pocket, drawstring hood, and ribbed cuffs. Pre-washed for ultimate softness and minimal shrinkage.',
        imageUrl: [
          'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
          'https://images.unsplash.com/photo-1614963366795-e60d92736e4d?w=800',
        ],
        price: 52000,
      },
      {
        title: 'Wrap Midi Skirt',
        description:
          'Versatile wrap skirt in flowing fabric with tie waist detail. Features asymmetric hem and subtle pattern. Easily dressed up or down for any occasion.',
        imageUrl: [
          'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800',
          'https://images.unsplash.com/photo-1590330297626-d7aff25a0431?w=800',
        ],
        price: 45000,
      },
      {
        title: 'Performance Polo Shirt',
        description:
          'Technical polo shirt with moisture-wicking properties. Features anti-odor treatment, UV protection, and four-way stretch. Perfect for golf or active lifestyle.',
        imageUrl: [
          'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800',
          'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=800',
        ],
        price: 48000,
      },
      {
        title: 'Turtleneck Ribbed Sweater',
        description:
          'Slim-fit turtleneck in fine-gauge ribbed knit. Made from soft cotton blend with excellent stretch and recovery. Ideal layering piece for fall and winter.',
        imageUrl: [
          'https://images.unsplash.com/photo-1609051214146-ae03bb730c14?w=800',
          'https://images.unsplash.com/photo-1619601030825-cbcef8f6035c?w=800',
        ],
        price: 44000,
      },
      {
        title: 'Distressed Boyfriend Jeans',
        description:
          'Relaxed boyfriend-fit jeans with authentic distressing and fading. Made from comfort-stretch denim with rolled cuffs. Effortlessly cool casual style.',
        imageUrl: [
          'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800',
          'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=800',
        ],
        price: 68000,
      },
      {
        title: 'Satin Bomber Jacket',
        description:
          'Luxe bomber jacket in smooth satin fabric with quilted lining. Features ribbed collar, cuffs, and hem, plus zip pockets. Shiny finish adds a fashion-forward edge.',
        imageUrl: [
          'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800',
          'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800',
        ],
        price: 78000,
      },
      {
        title: 'Linen Button-Down Shirt',
        description:
          'Breathable linen shirt perfect for summer. Features relaxed fit, mother-of-pearl buttons, and chest pocket. Natural fabric softens beautifully with wear.',
        imageUrl: [
          'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
          'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800',
        ],
        price: 54000,
      },
      {
        title: 'Knit Midi Dress',
        description:
          'Figure-hugging ribbed knit dress in midi length. Features long sleeves and mock neck. Versatile piece that transitions from day to night with ease.',
        imageUrl: [
          'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800',
          'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800',
        ],
        price: 56000,
      },
      {
        title: 'Corduroy Shirt Jacket',
        description:
          'Heavyweight corduroy overshirt with button closure. Features chest pockets and side pockets. Perfect layering piece with vintage-inspired appeal.',
        imageUrl: [
          'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
          'https://images.unsplash.com/photo-1525450824786-227cbef70703?w=800',
        ],
        price: 72000,
      },
      {
        title: 'Yoga Leggings',
        description:
          'High-waisted leggings with four-way stretch and compression support. Features moisture-wicking fabric, hidden pocket, and flatlock seams. Perfect for yoga or everyday wear.',
        imageUrl: [
          'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800',
          'https://images.unsplash.com/photo-1587837073080-448bc6a2329b?w=800',
        ],
        price: 42000,
      },
      {
        title: 'Chambray Work Shirt',
        description:
          'Classic work shirt in lightweight chambray fabric. Features button-down collar, double chest pockets with flaps, and durable construction. Gets better with age.',
        imageUrl: [
          'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800',
          'https://images.unsplash.com/photo-1598032895397-b9372f6c1815?w=800',
        ],
        price: 48000,
      },
      {
        title: 'Belted Trench Coat',
        description:
          'Double-breasted trench coat in water-resistant gabardine. Features storm flap, epaulettes, and detachable belt. Timeless outerwear piece for rainy days.',
        imageUrl: [
          'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=800',
          'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800',
          'https://images.unsplash.com/photo-1558769132-cb1aea1c8cf5?w=800',
        ],
        price: 165000,
      },
      {
        title: 'Jersey Maxi Dress',
        description:
          'Comfortable maxi dress in soft jersey fabric with relaxed fit. Features short sleeves, side pockets, and empire waist. Easy pull-on style perfect for effortless dressing.',
        imageUrl: [
          'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800',
          'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800',
        ],
        price: 52000,
      },
    ];

    try {
      await this.productService.batchAddProducts(products);
      console.log('✅ Successfully seeded 30 clothing products!');
    } catch (error) {
      console.error('❌ Error seeding products:', error);
    }
  }
}
