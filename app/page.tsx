import { serverFetch } from '@/lib/api';
import HeroBanner from '@/components/home/HeroBanner';
import CategoryGrid from '@/components/home/CategoryGrid';
import ProductSlider from '@/components/home/ProductSlider';
import FlashSaleBanner from '@/components/home/FlashSaleBanner';
import FeaturesBar from '@/components/home/FeaturesBar';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  const [flashSaleProducts, newArrivals, bestSellers] = await Promise.all([
    serverFetch<any>('/api/products?featured=flash-sale&limit=12'),
    serverFetch<any>('/api/products?featured=new-arrival&limit=12'),
    serverFetch<any>('/api/products?featured=best-seller&limit=12'),
  ]);

  return (
    <div>
      <HeroBanner />
      <FeaturesBar />
      <FlashSaleBanner products={flashSaleProducts.products} />
      <CategoryGrid />
      <ProductSlider title="New Arrivals ✨" subtitle="Fresh styles just dropped" products={newArrivals.products} link="/shop?sort=newest" />
      <ProductSlider title="Best Sellers 🏆" subtitle="Most loved by our customers" products={bestSellers.products} link="/shop?sort=best-selling" />
    </div>
  );
}
