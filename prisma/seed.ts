import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const k = (naira: number) => naira * 100;
const img = (id: number, variant: number = 0) =>
  `https://picsum.photos/seed/fashion${id}_${variant}/800/1000`;

async function main() {
  // Get categories (must exist from part1 or prior seed)
  const cats = await prisma.category.findMany();
  const catMap: Record<string, string> = {};
  cats.forEach(c => { catMap[c.slug] = c.id; });

  const womens = catMap['womens-clothing'];
  const mens = catMap['mens-clothing'];
  const shoes = catMap['shoes'];
  const bags = catMap['bags'];
  const accessories = catMap['accessories'];
  const beauty = catMap['beauty'];

  async function createProduct(p: any) {
    return prisma.product.create({
      data: {
        title: p.title, slug: p.slug, description: p.description,
        price: p.price, discount: p.discount ?? 0, stock: p.stock,
        rating: p.rating, reviewCount: p.reviewCount, categoryId: p.categoryId,
        isBestSeller: p.isBestSeller ?? false, isNewArrival: p.isNewArrival ?? false,
        isFlashSale: p.isFlashSale ?? false,
        images: { create: Array.from({ length: p.images }, (_, i) => ({
          url: img(i * 100 + p.slug.charCodeAt(0), i),
          alt: `${p.title} image ${i + 1}`, sortOrder: i,
        }))},
        sizes: { create: p.sizes.map((s: string) => ({ size: s, stock: Math.floor(p.stock / p.sizes.length) })) },
        colors: { create: p.colors },
      },
    });
  }

  // === CONTINUED MEN'S CLOTHING ===
  await createProduct({
    title: 'Jogger Sweatpants', slug: 'jogger-sweatpants',
    description: 'Comfortable jogger sweatpants with elasticated cuffs. Side pockets, modern tapered fit.',
    price: k(8000), discount: 0, stock: 140, rating: 4.4, reviewCount: 112, categoryId: mens,
    sizes: ['S','M','L','XL','XXL'],
    colors: [{color:'Black',hex:'#000000'},{color:'Grey Marl',hex:'#808080'},{color:'Navy',hex:'#000080'}],
    images: 4,
  });
  await createProduct({
    title: 'Kaftan Agbada Set', slug: 'kaftan-agbada-set',
    description: 'Regal three-piece Kaftan Agbada set from premium brocade with embroidery. For Nigerian celebrations.',
    price: k(45000), discount: 5, stock: 25, rating: 4.9, reviewCount: 31, isNewArrival: true, categoryId: mens,
    sizes: ['L','XL','XXL','3XL'],
    colors: [{color:'Royal Blue',hex:'#4169E1'},{color:'Wine',hex:'#722F37'},{color:'Gold',hex:'#FFD700'}],
    images: 4,
  });
  await createProduct({
    title: 'Graphic Print T-Shirt', slug: 'graphic-print-t-shirt',
    description: 'Trendy graphic print t-shirt from 100% combed cotton. Bold urban design.',
    price: k(5500), discount: 30, stock: 200, rating: 4.2, reviewCount: 89, isFlashSale: true, categoryId: mens,
    sizes: ['S','M','L','XL','XXL'],
    colors: [{color:'Black',hex:'#000000'},{color:'White',hex:'#FFFFFF'}],
    images: 4,
  });
  await createProduct({
    title: 'Cargo Shorts', slug: 'cargo-shorts',
    description: 'Practical cargo shorts with multiple pockets. Durable cotton ripstop, adjustable waistband.',
    price: k(7500), discount: 0, stock: 100, rating: 4.3, reviewCount: 65, categoryId: mens,
    sizes: ['30','32','34','36','38'],
    colors: [{color:'Khaki',hex:'#C3B091'},{color:'Olive',hex:'#808000'},{color:'Black',hex:'#000000'}],
    images: 4,
  });
  await createProduct({
    title: 'Quarter Zip Knit Sweater', slug: 'quarter-zip-knit-sweater',
    description: 'Sophisticated quarter zip knit sweater. Mock neck, ribbed cuffs. Layer over shirts.',
    price: k(11500), discount: 10, stock: 70, rating: 4.5, reviewCount: 44, categoryId: mens,
    sizes: ['M','L','XL','XXL'],
    colors: [{color:'Cream',hex:'#FFFDD0'},{color:'Navy',hex:'#000080'},{color:'Burgundy',hex:'#800020'}],
    images: 4,
  });

  // === SHOES ===
  await createProduct({
    title: 'Classic Leather Loafers', slug: 'classic-leather-loafers',
    description: 'Timeless leather loafers with cushioned insole and durable rubber sole. Perfect for office.',
    price: k(19500), discount: 0, stock: 65, rating: 4.6, reviewCount: 87, isBestSeller: true, categoryId: shoes,
    sizes: ['40','41','42','43','44','45'],
    colors: [{color:'Black',hex:'#000000'},{color:'Brown',hex:'#8B4513'},{color:'Burgundy',hex:'#800020'}],
    images: 4,
  });
  await createProduct({
    title: 'Block Heel Sandals', slug: 'block-heel-sandals',
    description: 'Stylish block heel sandals with ankle strap. 3-inch heel, cushioned footbed.',
    price: k(11000), discount: 20, stock: 90, rating: 4.4, reviewCount: 76, isNewArrival: true, categoryId: shoes,
    sizes: ['37','38','39','40','41'],
    colors: [{color:'Black',hex:'#000000'},{color:'Nude',hex:'#E3BC9A'},{color:'Red',hex:'#FF0000'}],
    images: 4,
  });
  await createProduct({
    title: 'Chunky Sneakers', slug: 'chunky-sneakers',
    description: 'On-trend chunky sneakers with thick platform sole. Breathable mesh and leather upper.',
    price: k(17500), discount: 10, stock: 75, rating: 4.5, reviewCount: 134, categoryId: shoes,
    sizes: ['38','39','40','41','42','43','44'],
    colors: [{color:'White/Black',hex:'#FFFFFF'},{color:'All White',hex:'#FFFFFF'},{color:'Beige/Gum',hex:'#F5F5DC'}],
    images: 4,
  });
  await createProduct({
    title: 'Flat Ballet Pumps', slug: 'flat-ballet-pumps',
    description: 'Elegant flat ballet pumps with cute bow detail. Soft leather-look upper, cushioned insole.',
    price: k(6500), discount: 30, stock: 150, rating: 4.3, reviewCount: 56, isFlashSale: true, categoryId: shoes,
    sizes: ['36','37','38','39','40','41'],
    colors: [{color:'Black',hex:'#000000'},{color:'Nude',hex:'#E3BC9A'},{color:'Blush',hex:'#FFB6C1'}],
    images: 4,
  });
  await createProduct({
    title: 'Leather Slides', slug: 'leather-slides',
    description: 'Minimalist leather slides with wide strap and molded footbed. For casual days.',
    price: k(7500), discount: 0, stock: 120, rating: 4.2, reviewCount: 48, categoryId: shoes,
    sizes: ['38','39','40','41','42','43','44','45'],
    colors: [{color:'Black',hex:'#000000'},{color:'Tan',hex:'#D2B48C'},{color:'White',hex:'#FFFFFF'}],
    images: 4,
  });
  await createProduct({
    title: 'Strappy Stiletto Heels', slug: 'strappy-stiletto-heels',
    description: 'Show-stopping strappy stiletto heels. 4-inch heel, pointed toe. Turn heads.',
    price: k(14500), discount: 15, stock: 55, rating: 4.6, reviewCount: 42, categoryId: shoes,
    sizes: ['37','38','39','40','41'],
    colors: [{color:'Black',hex:'#000000'},{color:'Silver',hex:'#C0C0C0'},{color:'Clear',hex:'#F0F0F0'}],
    images: 4,
  });
  await createProduct({
    title: 'Running Sneakers', slug: 'running-sneakers',
    description: 'Performance running sneakers with responsive cushioning. Breathable knit upper.',
    price: k(22000), discount: 0, stock: 80, rating: 4.7, reviewCount: 93, isBestSeller: true, categoryId: shoes,
    sizes: ['39','40','41','42','43','44','45'],
    colors: [{color:'Black/White',hex:'#000000'},{color:'Blue/Orange',hex:'#0000FF'},{color:'Grey/Neon',hex:'#808080'}],
    images: 4,
  });
  await createProduct({
    title: 'Embellished Wedding Slippers', slug: 'embellished-wedding-slippers',
    description: 'Luxurious embellished slippers with rhinestone detailing. Satin finish, 1-inch heel.',
    price: k(12500), discount: 10, stock: 35, rating: 4.8, reviewCount: 29, categoryId: shoes,
    sizes: ['37','38','39','40','41'],
    colors: [{color:'White',hex:'#FFFFFF'},{color:'Champagne',hex:'#F7E7CE'},{color:'Silver',hex:'#C0C0C0'}],
    images: 4,
  });

  // === BAGS ===
  await createProduct({
    title: 'Structured Tote Bag', slug: 'structured-tote-bag',
    description: 'Spacious structured tote bag that fits a laptop. Multiple interior pockets, magnetic closure.',
    price: k(16000), discount: 0, stock: 60, rating: 4.6, reviewCount: 74, isBestSeller: true, categoryId: bags,
    sizes: ['One Size'],
    colors: [{color:'Black',hex:'#000000'},{color:'Brown',hex:'#8B4513'},{color:'Cream',hex:'#FFFDD0'}],
    images: 4,
  });
  await createProduct({
    title: 'Mini Crossbody Bag', slug: 'mini-crossbody-bag',
    description: 'Compact crossbody bag with adjustable strap. Zip closure, fits phone and cards.',
    price: k(7000), discount: 25, stock: 100, rating: 4.4, reviewCount: 58, isFlashSale: true, categoryId: bags,
    sizes: ['One Size'],
    colors: [{color:'Black',hex:'#000000'},{color:'Pink',hex:'#FFC0CB'},{color:'Tan',hex:'#D2B48C'},{color:'Green',hex:'#228B22'}],
    images: 4,
  });
  await createProduct({
    title: 'Leather Backpack', slug: 'leather-backpack',
    description: 'Stylish leather backpack with padded laptop compartment. Multiple pockets.',
    price: k(21000), discount: 15, stock: 45, rating: 4.7, reviewCount: 67, categoryId: bags,
    sizes: ['One Size'],
    colors: [{color:'Black',hex:'#000000'},{color:'Brown',hex:'#8B4513'}],
    images: 4,
  });
  await createProduct({
    title: 'Beaded Evening Clutch', slug: 'beaded-evening-clutch',
    description: 'Exquisite hand-beaded evening clutch with satin lining. Detachable chain strap.',
    price: k(12000), discount: 0, stock: 30, rating: 4.8, reviewCount: 23, isNewArrival: true, categoryId: bags,
    sizes: ['One Size'],
    colors: [{color:'Gold',hex:'#FFD700'},{color:'Silver',hex:'#C0C0C0'},{color:'Black',hex:'#000000'}],
    images: 4,
  });
  await createProduct({
    title: 'Canvas Shopper Bag', slug: 'canvas-shopper-bag',
    description: 'Eco-friendly canvas shopper with Lagos-inspired print. Reinforced handles, spacious interior.',
    price: k(4500), discount: 0, stock: 200, rating: 4.3, reviewCount: 82, categoryId: bags,
    sizes: ['One Size'],
    colors: [{color:'Natural',hex:'#F5DEB3'},{color:'Black',hex:'#000000'}],
    images: 4,
  });

  // === ACCESSORIES ===
  await createProduct({
    title: 'Gold Layered Necklace Set', slug: 'gold-layered-necklace-set',
    description: 'Trendy layered necklace set with coin and bar pendants. Three chains of varying lengths.',
    price: k(5500), discount: 20, stock: 160, rating: 4.5, reviewCount: 145, isBestSeller: true, categoryId: accessories,
    sizes: ['One Size'],
    colors: [{color:'Gold',hex:'#FFD700'},{color:'Silver',hex:'#C0C0C0'}],
    images: 4,
  });
  await createProduct({
    title: 'Cat Eye Sunglasses', slug: 'cat-eye-sunglasses',
    description: 'Retro-inspired cat eye sunglasses with UV400 protection. Bold frame, gradient lenses.',
    price: k(4000), discount: 35, stock: 130, rating: 4.3, reviewCount: 91, isFlashSale: true, categoryId: accessories,
    sizes: ['One Size'],
    colors: [{color:'Black',hex:'#000000'},{color:'Tortoise',hex:'#8B6914'},{color:'Red',hex:'#FF0000'}],
    images: 4,
  });
  await createProduct({
    title: 'Silk Headwrap (Gele)', slug: 'silk-headwrap-gele',
    description: 'Premium silk headwrap ready to style. Luxurious silk with sheen. For church and weddings.',
    price: k(6000), discount: 0, stock: 90, rating: 4.7, reviewCount: 63, categoryId: accessories,
    sizes: ['One Size'],
    colors: [{color:'Magenta',hex:'#FF00FF'},{color:'Royal Blue',hex:'#4169E1'},{color:'Gold',hex:'#FFD700'},{color:'Emerald',hex:'#50C878'}],
    images: 4,
  });
  await createProduct({
    title: 'Statement Earrings Set', slug: 'statement-earrings-set',
    description: 'Set of 5 statement earrings — hoops, tassels, studs, drops. Mix and match.',
    price: k(4500), discount: 0, stock: 180, rating: 4.4, reviewCount: 112, isNewArrival: true, categoryId: accessories,
    sizes: ['One Size'],
    colors: [{color:'Mixed Metals',hex:'#C0C0C0'}],
    images: 4,
  });
  await createProduct({
    title: 'Leather Waist Belt', slug: 'leather-waist-belt',
    description: 'Classic leather waist belt with sleek buckle. Adjustable sizing, versatile width.',
    price: k(5000), discount: 10, stock: 110, rating: 4.5, reviewCount: 76, categoryId: accessories,
    sizes: ['S/M','M/L','L/XL'],
    colors: [{color:'Black',hex:'#000000'},{color:'Brown',hex:'#8B4513'},{color:'Tan',hex:'#D2B48C'}],
    images: 4,
  });

  // === BEAUTY ===
  await createProduct({
    title: 'Matte Liquid Lipstick Set', slug: 'matte-liquid-lipstick-set',
    description: 'Set of 6 long-lasting matte liquid lipsticks. Lightweight, non-drying formula.',
    price: k(8500), discount: 0, stock: 140, rating: 4.6, reviewCount: 198, isBestSeller: true, categoryId: beauty,
    sizes: ['One Size'],
    colors: [{color:'Nude Collection',hex:'#D2B48C'},{color:'Bold Collection',hex:'#FF0000'}],
    images: 4,
  });
  await createProduct({
    title: 'Natural Shea Butter Body Cream', slug: 'natural-shea-butter-body-cream',
    description: 'Rich whipped shea butter cream with coconut oil and vitamin E. Deeply moisturizes. Made in Nigeria.',
    price: k(4500), discount: 15, stock: 200, rating: 4.7, reviewCount: 234, isBestSeller: true, categoryId: beauty,
    sizes: ['200ml','400ml'],
    colors: [{color:'Natural',hex:'#F5DEB3'}],
    images: 3,
  });
  await createProduct({
    title: 'Full Coverage Foundation', slug: 'full-coverage-foundation',
    description: 'Full coverage foundation with a natural matte finish. Wide shade range for melanin-rich skin tones.',
    price: k(7500), discount: 10, stock: 100, rating: 4.5, reviewCount: 167, categoryId: beauty,
    sizes: ['30ml'],
    colors: [{color:'Caramel',hex:'#C68E58'},{color:'Cocoa',hex:'#6B4226'},{color:'Espresso',hex:'#3B1F0B'},{color:'Honey',hex:'#D4A574'},{color:'Mocha',hex:'#8B5A2B'}],
    images: 4,
  });
  await createProduct({
    title: 'Edge Control Gel', slug: 'edge-control-gel',
    description: 'Extra hold edge control gel that lays edges without flaking. Non-greasy, long-lasting formula.',
    price: k(3000), discount: 20, stock: 250, rating: 4.4, reviewCount: 312, isFlashSale: true, categoryId: beauty,
    sizes: ['100g'],
    colors: [{color:'Clear',hex:'#FFFFFF'}],
    images: 3,
  });
  await createProduct({
    title: 'Perfume Oil Collection', slug: 'perfume-oil-collection',
    description: 'Set of 3 luxurious perfume oils in floral, oud, and musk scents. Alcohol-free, long-lasting.',
    price: k(9500), discount: 0, stock: 80, rating: 4.8, reviewCount: 89, isNewArrival: true, categoryId: beauty,
    sizes: ['3 x 12ml'],
    colors: [{color:'Assorted',hex:'#C0C0C0'}],
    images: 4,
  });

  const count = await prisma.product.count();
  console.log(`✅ Seeded ${count} products successfully!`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
