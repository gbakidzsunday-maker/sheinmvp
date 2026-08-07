import { serverFetch } from '@/lib/api';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/product/ProductDetailClient';
import type { ProductDetail, ProductListItem } from '@/types';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let data: { product: ProductDetail; related: ProductListItem[] };
  try {
    data = await serverFetch(`/api/products/${slug}`);
  } catch {
    notFound();
  }

  if (!data.product) notFound();

  return <ProductDetailClient product={data.product} related={data.related} />;
}
