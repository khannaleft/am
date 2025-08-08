
'use client';

import React from 'react';
import { useAppContext } from '@/hooks/useAppContext';
import WishlistPage from '@/components/WishlistPage';
import { useRouter } from 'next/navigation';

export default function Wishlist() {
    const { products, wishlistItems, cartItems, handleAddToCart, handleToggleWishlist, stores } = useAppContext();
    const router = useRouter();

    const wishlistedProducts = products.filter(p => wishlistItems.includes(p.id));

    const handleProductClick = (productId: number) => {
        const product = products.find(p => p.id === productId);
        if (product) {
            const store = stores.find(s => s.id === product.storeId);
            if (store) {
                 router.push(`/${store.slug}?product=${productId}`);
            }
        }
    };
    
    return (
        <WishlistPage
            wishlistedProducts={wishlistedProducts}
            onBack={() => router.back()}
            onAddToCart={handleAddToCart}
            onProductClick={handleProductClick}
            onToggleWishlist={handleToggleWishlist}
            wishlistItems={wishlistItems}
            cartItems={Object.values(cartItems).flat()}
        />
    );
}