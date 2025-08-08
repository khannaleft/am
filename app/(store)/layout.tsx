
import React from 'react';
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getStores } from '@/services/firebaseService';

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string } // This is actually the slug now
}) {
  const stores = await getStores();
  const currentStore = stores.find(s => s.slug === params.storeId);
  const selectedStoreId = currentStore ? currentStore.id : null;

  return (
    <div className="bg-primary min-h-screen text-text-primary transition-colors duration-500">
      <div className="fixed inset-0 z-[-1] overflow-hidden">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl animate-subtle-blob"></div>
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-pink-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-subtle-blob" style={{animationDelay: '5s'}}></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
          <Header selectedStoreId={selectedStoreId} />
          <main className="flex-grow">
              {children}
          </main>
          <Footer />
      </div>
    </div>
  );
}