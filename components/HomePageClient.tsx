
'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { Store } from '@/types';
import { useRouter } from 'next/navigation';
import Header from './Header';
import Image from 'next/image';
import Icon from './Icon';
import OfferCarousel, { Offer } from './OfferCarousel';

// Mock data for the carousel offers
const offers: Offer[] = [
  {
    id: 1,
    title: 'First Purchase, 15% Off',
    description: 'Begin your journey with Aura and enjoy a special discount on your first order. Use code AURA15.',
    imageUrl: 'https://images.unsplash.com/photo-1598454449072-3544a3fb3af8?q=80&w=2574&auto=format&fit=crop',
    ctaText: 'Shop Face Care',
    ctaLink: '/1' 
  },
  {
    id: 2,
    title: 'Free Shipping Over ₹5000',
    description: 'Indulge in our complete collection and we\'ll deliver it to your doorstep, on us.',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=2564&auto=format&fit=crop',
    ctaText: 'Explore All Products',
    ctaLink: '/2'
  },
  {
    id: 3,
    title: 'New! The Serenity Body Oil',
    description: 'Discover our latest creation, a calming blend of lavender and chamomile for ultimate relaxation.',
    imageUrl: 'https://images.unsplash.com/photo-1563237023-b1e970526dcb?q=80&w=2574&auto=format&fit=crop',
    ctaText: 'Discover Now',
    ctaLink: '/1'
  },
];


interface HomePageClientProps {
    stores: Store[];
}

interface StoreWithDistance extends Store {
    distance?: number;
}

const HomePageClientContent: React.FC<HomePageClientProps> = ({ stores }) => {
    const router = useRouter();

    const [allStores, setAllStores] = useState<StoreWithDistance[]>(stores);
    const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [locationError, setLocationError] = useState<string | null>(null);

    useEffect(() => {
        setAllStores(stores);
    }, [stores]);

    const handleSelectStore = (id: number) => {
        router.push(`/${id}`);
    };

    const haversineDistance = (coords1: { latitude: number; longitude: number }, coords2: { latitude: number; longitude: number }): number => {
        const toRad = (x: number) => (x * Math.PI) / 180;
        const R = 6371;
        const dLat = toRad(coords2.latitude - coords1.latitude);
        const dLon = toRad(coords2.longitude - coords1.longitude);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(coords1.latitude)) * Math.cos(toRad(coords2.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const handleFindNearby = () => {
        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser.");
            setLocationStatus('error');
            return;
        }
        setLocationStatus('loading');
        setLocationError(null);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userCoords = { latitude: position.coords.latitude, longitude: position.coords.longitude };
                const storesWithDistances = stores.map((store) => ({ ...store, distance: haversineDistance(userCoords, { latitude: store.latitude, longitude: store.longitude }) }))
                                                  .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
                setAllStores(storesWithDistances);
                setLocationStatus('success');
            },
            () => {
                setLocationError("Could not get your location. Please ensure location services are enabled.");
                setLocationStatus('error');
            }
        );
    };

    return (
        <div className="min-h-screen bg-primary">
            <Header selectedStoreId={null} />
            
            <div className="container mx-auto px-4 pt-32 md:pt-40 animate-fade-in-up">
                <OfferCarousel offers={offers} />
            </div>
            
            <main className="w-full flex flex-col items-center py-16 md:py-24">
                <div className="text-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-text-primary mb-4">
                        Our Sanctuaries
                    </h2>
                    <p className="text-lg md:text-xl text-text-secondary mb-12 max-w-2xl mx-auto">
                        Your journey to natural radiance begins here. Please select a store to begin shopping.
                    </p>
                </div>
                
                <div className="flex flex-col items-center justify-center mb-8 gap-4 animate-fade-in-up" style={{animationDelay: '300ms'}}>
                    <button 
                        onClick={handleFindNearby}
                        disabled={locationStatus === 'loading'}
                        className="flex items-center gap-3 bg-secondary text-text-primary font-bold py-3 px-6 rounded-lg border border-glass-border hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-wait"
                    >
                        <Icon name="location-marker" className="w-5 h-5 text-accent" />
                        {locationStatus === 'loading' ? 'Finding You...' : 'Find Nearby Stores'}
                    </button>
                    {locationError && <p className="text-red-500 text-sm max-w-md mx-auto mt-2 bg-red-500/10 p-2 rounded-md">{locationError}</p>}
                </div>
                
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full animate-fade-in-up" style={{animationDelay: '400ms'}}>
                {allStores.map(store => (
                    <div key={store.id} className="bg-secondary border border-glass-border rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col group overflow-hidden">
                        <div className="relative w-full h-48">
                           <Image src={store.bannerUrl} alt={`${store.name} banner`} layout="fill" objectFit="cover" className="opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-6 flex flex-col flex-grow text-left">
                            <h3 className="text-2xl font-serif font-bold text-text-primary mb-1 group-hover:text-accent transition-colors">{store.name}</h3>
                            <div className="flex justify-between items-baseline mb-6">
                                <p className="text-text-secondary">{store.location}</p>
                                {store.distance !== undefined && (
                                    <span className="text-sm font-semibold bg-accent/20 text-accent py-1 px-2 rounded-full">{store.distance.toFixed(1)} km</span>
                                )}
                            </div>
                            <button
                            onClick={() => handleSelectStore(store.id)}
                            className="mt-auto bg-accent text-white font-bold py-3 px-6 rounded-lg hover:opacity-85 transition-all duration-300 transform group-hover:scale-105 self-start"
                            >
                            Shop Here
                            </button>
                        </div>
                    </div>
                ))}
                </div>
            </main>
        </div>
    );
};

const HomePageClient: React.FC<HomePageClientProps> = (props) => (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-primary text-text-primary">Loading...</div>}>
        <HomePageClientContent {...props} />
    </Suspense>
);


export default HomePageClient;