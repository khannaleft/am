
'use client';

import React from 'react';
import { Order } from '@/types';
import Icon from './Icon';
import Link from 'next/link';

interface OrderSuccessPageProps {
  order: Order;
}

const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ order }) => {
  return (
    <div className="container mx-auto px-4 py-12 pt-32 md:pt-40 animate-fade-in-up">
      <div className="max-w-3xl mx-auto bg-secondary/50 border border-glass-border rounded-2xl shadow-lg p-8 md:p-12 text-center">
        <Icon name="check-circle" className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-text-primary">Order Placed Successfully!</h1>
        <p className="text-lg text-text-secondary mt-3">
          Thank you for your purchase. A confirmation email has been sent to <span className="font-semibold text-accent">{order.userEmail}</span>.
        </p>
        <p className="text-sm text-text-secondary mt-2">
          Order ID: <span className="font-mono bg-primary px-2 py-1 rounded">#{order.id}</span>
        </p>
        
        <div className="text-left bg-primary/60 border border-glass-border rounded-xl p-6 my-8">
            <h2 className="text-xl font-bold font-serif mb-4">Order Summary</h2>
            <ul className="space-y-4 mb-4">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-4">
                    <img src={item.imageUrls[0]} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-secondary" />
                    <div className="flex-grow">
                      <h3 className="font-bold">{item.name}</h3>
                      <p className="text-sm text-text-secondary">
                        {item.quantity} x ₹{(item.discountPrice ?? item.price).toFixed(2)}
                      </p>
                    </div>
                    <p className="font-semibold">₹{((item.discountPrice ?? item.price) * item.quantity).toFixed(2)}</p>
                  </li>
                ))}
            </ul>
             <div className="border-t border-glass-border pt-4 text-sm text-text-secondary space-y-1">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-text-primary font-medium">₹{order.subtotal.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                    <div className="flex justify-between text-green-500">
                        <span>Discount</span>
                        <span className="font-medium">-₹{order.discount.toFixed(2)}</span>
                    </div>
                )}
                 <div className="flex justify-between">
                    <span>Taxes</span>
                    <span className="text-text-primary font-medium">₹{order.taxes.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-text-primary mt-2 border-t border-glass-border pt-2">
                    <span>Total Paid</span>
                    <span>₹{order.total.toFixed(2)}</span>
                </div>
            </div>
        </div>

        <Link
          href="/orders"
          className="inline-block bg-accent text-white font-bold py-3 px-8 rounded-lg hover:opacity-85 transition-all duration-300 transform hover:scale-105"
        >
          View All My Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
