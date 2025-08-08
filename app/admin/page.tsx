'use client';
import React from 'react';
import { useAppContext } from '@/hooks/useAppContext';
import AdminPanelPage from '@/components/AdminPanelPage';
import { useRouter } from 'next/navigation';

export default function Admin() {
    const context = useAppContext();
    const router = useRouter();
    
    if (context.isLoading) {
        return <div className="pt-40 text-center">Loading...</div>;
    }

    if (context.currentUser?.role !== 'admin') {
        return (
            <div className="container mx-auto text-center pt-40">
                <h1 className="text-2xl font-bold">Access Denied</h1>
                <p>You must be an administrator to view this page.</p>
            </div>
        );
    }
    
    return (
        <AdminPanelPage
            onBack={() => router.back()}
            allProducts={context.products}
            onAddProduct={context.handleAddProduct}
            allOrders={context.orders}
            onUpdateOrderStatus={context.handleUpdateOrderStatus}
            allDiscountCodes={context.discountCodes}
            onAddDiscountCode={context.handleAddDiscountCode}
            onDeleteDiscountCode={context.handleDeleteDiscountCode}
            stores={context.stores}
            addToast={context.addToast}
        />
    );
}
