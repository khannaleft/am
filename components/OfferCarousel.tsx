
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Icon from './Icon';
import Image from 'next/image';
import Link from 'next/link';

// Interface for offers for the carousel
export interface Offer {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
}

interface OfferCarouselProps {
  offers: Offer[];
}

const OfferCarousel: React.FC<OfferCarouselProps> = ({ offers }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex(prevIndex => (prevIndex === offers.length - 1 ? 0 : prevIndex + 1));
  }, [offers.length]);

  const prevSlide = () => {
    setCurrentIndex(prevIndex => (prevIndex === 0 ? offers.length - 1 : prevIndex - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (offers.length <= 1) return;
    const slideInterval = setInterval(nextSlide, 5000); // Auto-play every 5 seconds
    return () => clearInterval(slideInterval);
  }, [nextSlide, offers.length]);

  if (!offers || offers.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-80 md:h-[450px] lg:h-[500px] overflow-hidden rounded-3xl shadow-lg group bg-secondary">
      {offers.map((offer, index) => (
        <div
          key={offer.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <Image
            src={offer.imageUrl}
            alt={offer.title}
            layout="fill"
            objectFit="cover"
            className="transform transition-transform duration-700 ease-in-out"
            style={{ transform: index === currentIndex ? 'scale(1.05)' : 'scale(1)' }}
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white w-full md:w-3/4 lg:w-2/3">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-3 drop-shadow-lg">
              {offer.title}
            </h2>
            <p className="text-lg md:text-xl max-w-lg mb-6 drop-shadow-md">
              {offer.description}
            </p>
            <Link
              href={offer.ctaLink}
              className="bg-accent text-white font-bold py-3 px-8 rounded-lg hover:opacity-85 transition-all duration-300 transform hover:scale-105 inline-block"
            >
              {offer.ctaText}
            </Link>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {offers.length > 1 && (
        <>
            <button
                onClick={prevSlide}
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 text-white p-3 rounded-full hover:bg-black/50 transition-all duration-300 opacity-0 group-hover:opacity-100 z-20"
                aria-label="Previous slide"
            >
                <Icon name="chevron-left" className="w-6 h-6" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 text-white p-3 rounded-full hover:bg-black/50 transition-all duration-300 opacity-0 group-hover:opacity-100 z-20"
                aria-label="Next slide"
            >
                <Icon name="chevron-right" className="w-6 h-6" />
            </button>
        </>
      )}


      {/* Dot Indicators */}
      {offers.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {offers.map((_, index) => (
            <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentIndex === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white'
                }`}
                aria-label={`Go to slide ${index + 1}`}
            ></button>
            ))}
        </div>
      )}
    </div>
  );
};

export default OfferCarousel;
