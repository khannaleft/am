'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { Store } from '@/types';
import Header from './Header';
import Image from 'next/image';
import Icon from './Icon';
import OfferCarousel from './OfferCarousel';
import { useAppContext } from '@/hooks/useAppContext';
import Link from 'next/link';

interface HomePageClientProps {
    stores: Store[];
}

interface StoreWithDistance extends Store {
    distance?: number;
}

const HomePageClientContent: React.FC<HomePageClientProps> = ({ stores }) => {
    const { offers } = useAppContext();

    const [allStores, setAllStores] = useState<StoreWithDistance[]>(stores);
    const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [locationError, setLocationError] = useState<string | null>(null);

    useEffect(() => {
        setAllStores(stores);
    }, [stores]);

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
                    <Link
                      key={store.id}
                      href={`/${store.slug}`}
                      className="bg-secondary border border-glass-border rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col group overflow-hidden cursor-pointer"
                    >
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
                            <div className="mt-auto self-start flex items-center gap-2 text-accent font-bold">
                                <span>Shop Now</span>
                                <Icon name="chevron-right" className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                            </div>
                        </div>
                    </Link>
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