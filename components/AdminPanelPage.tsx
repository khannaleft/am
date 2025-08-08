
import React, { useState } from 'react';
import { Product, Order, DiscountCode, Store, Toast, Offer } from '../types';
import Icon from './Icon';
import AddProductModal from './AddProductModal';
import OfferManagement from './OfferManagement';

interface AdminPanelPageProps {
  onBack: () => void;
  allProducts: Product[];
  onAddProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  allOrders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  allDiscountCodes: DiscountCode[];
  onAddDiscountCode: (code: DiscountCode) => void;
  onDeleteDiscountCode: (code: string) => void;
  stores: Store[];
  addToast: (message: string, type?: Toast['type']) => void;
  categories: string[];
  onAddCategory: (category: string) => Promise<void>;
  offers: Offer[];
  onAddOffer: (offerData: Omit<Offer, 'id'>) => Promise<void>;
  onUpdateOffer: (offerId: string, offerData: Partial<Omit<Offer, 'id'>>) => Promise<void>;
  onDeleteOffer: (offerId: string) => Promise<void>;
}

type AdminTab = 'products' | 'orders' | 'discounts' | 'offers';

const AdminPanelPage: React.FC<AdminPanelPageProps> = (props) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  
  const tabs: { id: AdminTab; name: string; icon: React.ComponentProps<typeof Icon>['name'] }[] = [
    { id: 'products', name: 'Products', icon: 'package' },
    { id: 'orders', name: 'Orders', icon: 'clipboard-list' },
    { id: 'discounts', name: 'Discounts', icon: 'tag' },
    { id: 'offers', name: 'Offers', icon: 'sparkles' },
  ];

  const handleAddProduct = async (product: Omit<Product, 'id'>) => {
      await props.onAddProduct(product);
  }

  return (
    <>
    <div className="container mx-auto px-4 py-12 pt-32 md:pt-40 animate-fade-in-up">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-text-primary flex items-center gap-3">
            <Icon name="shield-check" className="w-10 h-10 text-accent"/>
            Admin Panel
        </h1>
        <button
          onClick={props.onBack}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          Back to Shop
        </button>
      </div>
      
      <div className="bg-secondary/50 border border-glass-border rounded-2xl shadow-lg p-2 md:p-4">
        <div className="flex items-center border-b border-glass-border overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-4 md:px-6 font-semibold transition-colors flex-shrink-0 ${activeTab === tab.id ? 'text-accent border-b-2 border-accent' : 'text-text-secondary hover:text-text-primary'}`}
            >
              <Icon name={tab.icon} className="w-5 h-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
        
        <div className="p-4 md:p-6 min-h-[400px]">
          {activeTab === 'products' && <ProductManagement {...props} onAddProductClick={() => setIsAddProductModalOpen(true)} />}
          {activeTab === 'orders' && <OrderManagement {...props} />}
          {activeTab === 'discounts' && <DiscountManagement {...props} addToast={props.addToast} />}
          {activeTab === 'offers' && <OfferManagement offers={props.offers} onAddOffer={props.onAddOffer} onUpdateOffer={props.onUpdateOffer} onDeleteOffer={props.onDeleteOffer} />}
        </div>
      </div>
    </div>
    <AddProductModal 
        isOpen={isAddProductModalOpen} 
        onClose={() => setIsAddProductModalOpen(false)} 
        onAddProduct={handleAddProduct}
        stores={props.stores} 
        addToast={props.addToast}
        categories={props.categories}
        onAddCategory={props.onAddCategory}
    />
    </>
  );
};

const ProductManagement = ({ allProducts, onAddProductClick, stores }: { allProducts: Product[], onAddProductClick: () => void, stores: Store[] }) => {
    const getStoreName = (storeId: number) => stores.find(s => s.id === storeId)?.name || 'N/A';
    
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Manage Products ({allProducts.length})</h2>
            <button onClick={onAddProductClick} className="flex items-center gap-2 bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition-all duration-300">
                <Icon name="plus-circle" className="w-5 h-5" />
                Add Product
            </button>
        </div>
        <div className="overflow-x-auto bg-primary p-4 rounded-lg">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-glass-border">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Store</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Stock</th>
              </tr>
            </thead>
            <tbody>
              {allProducts.map(product => (
                <tr key={product.id} className="border-b border-glass-border last:border-none hover:bg-secondary">
                  <td className="p-4 font-semibold">{product.name}</td>
                  <td className="p-4 text-text-secondary">{getStoreName(product.storeId)}</td>
                  <td className="p-4 text-text-secondary">{product.category}</td>
                  <td className="p-4">₹{product.price.toFixed(2)}</td>
                  <td className="p-4">{product.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
};

const OrderManagement = ({ allOrders, onUpdateOrderStatus }: { allOrders: Order[], onUpdateOrderStatus: (orderId: string, status: Order['status']) => void }) => (
    <div>
      <h2 className="text-2xl font-bold mb-4">All Orders ({allOrders.length})</h2>
      <div className="overflow-x-auto bg-primary p-4 rounded-lg">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-glass-border">
            <th className="p-4 font-semibold">Order ID</th>
            <th className="p-4 font-semibold">User</th>
            <th className="p-4 font-semibold">Date</th>
            <th className="p-4 font-semibold">Total</th>
            <th className="p-4 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {allOrders.map(order => (
            <tr key={order.id} className="border-b border-glass-border last:border-none hover:bg-secondary">
              <td className="p-4 font-mono text-xs">{order.id}</td>
              <td className="p-4 text-text-secondary">{order.userEmail}</td>
              <td className="p-4">{new Date(order.date).toLocaleDateString()}</td>
              <td className="p-4 font-semibold">₹{order.total.toFixed(2)}</td>
              <td className="p-4">
                <select 
                    value={order.status}
                    onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                    className="p-2 rounded-lg bg-secondary border border-glass-border focus:outline-none focus:ring-1 focus:ring-accent"
                >
                    <option>Pending Payment</option>
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
);

const DiscountManagement = (props : {
    allDiscountCodes: DiscountCode[],
    onDeleteDiscountCode: (code: string) => void,
    onAddDiscountCode: (code: DiscountCode) => void,
    addToast: (message: string, type?: Toast['type']) => void,
}) => {
    const [newDiscountCode, setNewDiscountCode] = useState('');
    const [newDiscountValue, setNewDiscountValue] = useState(0);
    const [newDiscountType, setNewDiscountType] = useState<'percentage' | 'fixed'>('percentage');

    const handleAddDiscount = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDiscountCode.trim() || newDiscountValue <= 0) {
            props.addToast('Please enter a valid code and value.', 'error');
            return;
        }
        props.onAddDiscountCode({
            code: newDiscountCode.trim().toUpperCase(),
            value: newDiscountValue,
            type: newDiscountType
        });
        setNewDiscountCode('');
        setNewDiscountValue(0);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Manage Discount Codes</h2>
            <form onSubmit={handleAddDiscount} className="mb-6 bg-primary p-4 rounded-lg flex flex-col md:flex-row items-end gap-4 border border-glass-border">
                <div className="flex-grow w-full">
                    <label className="block text-sm font-medium text-text-secondary mb-1">New Code</label>
                    <input type="text" value={newDiscountCode} onChange={e => setNewDiscountCode(e.target.value)} placeholder="e.g., AURA20" className="w-full p-2.5 rounded-lg bg-secondary border border-glass-border focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                 <div className="w-full md:w-48">
                    <label className="block text-sm font-medium text-text-secondary mb-1">Value</label>
                    <input type="number" value={newDiscountValue} onChange={e => setNewDiscountValue(parseFloat(e.target.value) || 0)} className="w-full p-2.5 rounded-lg bg-secondary border border-glass-border focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                 <div className="w-full md:w-48">
                    <label className="block text-sm font-medium text-text-secondary mb-1">Type</label>
                     <select value={newDiscountType} onChange={e => setNewDiscountType(e.target.value as 'percentage' | 'fixed')} className="w-full p-2.5 rounded-lg bg-secondary border border-glass-border focus:outline-none focus:ring-2 focus:ring-accent">
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed (₹)</option>
                    </select>
                </div>
                <button type="submit" className="w-full md:w-auto bg-accent text-white font-bold py-2.5 px-6 rounded-lg hover:bg-opacity-80 transition-all duration-300">Add Code</button>
            </form>

            <div className="overflow-x-auto bg-primary p-4 rounded-lg">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-glass-border">
                            <th className="p-4 font-semibold">Code</th>
                            <th className="p-4 font-semibold">Value</th>
                            <th className="p-4 font-semibold">Type</th>
                            <th className="p-4 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {props.allDiscountCodes.map(code => (
                        <tr key={code.code} className="border-b border-glass-border last:border-none hover:bg-secondary">
                            <td className="p-4 font-mono font-semibold">{code.code}</td>
                            <td className="p-4">{code.type === 'percentage' ? `${code.value}%` : `₹${code.value.toFixed(2)}`}</td>
                            <td className="p-4 capitalize text-text-secondary">{code.type}</td>
                            <td className="p-4">
                                <button onClick={() => props.onDeleteDiscountCode(code.code)} className="text-red-500 hover:underline">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminPanelPage;