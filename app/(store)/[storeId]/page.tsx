
import ShopPageClient from "./ShopPageClient";
import { getProducts, getStores } from "@/services/firebaseService";
import { notFound } from "next/navigation";

interface ShopPageProps {
  params: { storeId: string }; // This is the slug
}

export default async function ShopPage({ params }: ShopPageProps) {
  const [allProducts, allStores] = await Promise.all([
    getProducts(),
    getStores()
  ]);
  const slug = params.storeId;

  const currentStore = allStores.find(s => s.slug === slug);

  if (!currentStore) {
    notFound();
  }
  
  const storeId = currentStore.id;
  const storeProducts = allProducts.filter(p => p.storeId === storeId);
  
  return <ShopPageClient products={storeProducts} storeId={storeId} />;
}