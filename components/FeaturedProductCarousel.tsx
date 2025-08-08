
'use client';

import React, { useState, useCallback } from 'react';
import { Product } from '../types';
import Icon from './Icon';
import Image from 'next/image';

interface FeaturedProductCarouselProps {
  products: Product[];
  onProductClick: (productId: number) => void;
  onAddToCart: (product: Product) => void;
}

const FeaturedProductCarousel: React.FC<FeaturedProductCarouselProps> = ({ products, onProductClick, onAddToCart }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex(prevIndex => (prevIndex === products.length - 1 ? 0 : prevIndex + 1));
  }, [products.length]);

  const prevSlide = () => {
    setCurrentIndex(prevIndex => (prevIndex === 0 ? products.length - 1 : prevIndex - 1));
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 pb-12">
        <div className="relative w-full h-[400px] md:h-[350px] overflow-hidden rounded-3xl shadow-lg group bg-secondary/50 border border-glass-border">
        {products.map((product, index) => (
            <div
            key={product.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            >
                <div className="w-full h-full flex flex-col md:flex-row items-center">
                    <div className="relative w-full md:w-1/2 h-1/2 md:h-full flex-shrink-0">
                        <Image
                            src={product.imageUrls[0]}
                            alt={product.name}
                            layout="fill"
                            objectFit="cover"
                            className="transform transition-transform duration-700 ease-in-out"
                            style={{ transform: index === currentIndex ? 'scale(1.05)' : 'scale(1)' }}
                        />
                         <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/50 via-black/20 to-transparent"></div>
                    </div>
                    <div className="relative text-text-primary p-8 md:p-12 w-full md:w-1/2 flex flex-col justify-center text-center md:text-left">
                        <p className="text-sm text-accent font-bold uppercase tracking-wider mb-2">Featured Product</p>
                        <h2 className="text-3xl lg:text-4xl font-serif font-bold mb-3">
                            {product.name}
                        </h2>
                        <p className="text-md text-text-secondary max-w-lg mb-6 line-clamp-2">
                            {product.description}
                        </p>
                        <div className="flex items-center gap-4 justify-center md:justify-start">
                            <button
                                onClick={() => onProductClick(product.id)}
                                className="bg-accent text-white font-bold py-3 px-6 rounded-lg hover:opacity-85 transition-all duration-300 transform hover:scale-105"
                                >
                                View Details
                            </button>
                            <span className="text-2xl font-bold font-sans text-text-primary">
                                ₹{product.price.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        ))}

        {/* Navigation Arrows */}
        {products.length > 1 && (
            <>
                <button
                    onClick={prevSlide}
                    className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 text-white p-3 rounded-full hover:bg-black/50 transition-all duration-300 opacity-0 group-hover:opacity-100 z-20"
                    aria-label="Previous featured product"
                >
                    <Icon name="chevron-left" className="w-6 h-6" />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 text-white p-3 rounded-full hover:bg-black/50 transition-all duration-300 opacity-0 group-hover:opacity-100 z-20"
                    aria-label="Next featured product"
                >
                    <Icon name="chevron-right" className="w-6 h-6" />
                </button>
            </>
        )}
        </div>
    </div>
  );
};

export default FeaturedProductCarousel;
