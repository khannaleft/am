
import React, { useState } from 'react';
import { Product, Order, DiscountCode, Store, Toast } from '../types';
import Icon from './Icon';
import AddProductModal from './AddProductModal';

interface AdminPanelPageProps {
  onBack: () => void;
  allProducts: Product[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  allOrders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  allDiscountCodes: DiscountCode[];
  onAddDiscountCode: (code: DiscountCode) => void;
  onDeleteDiscountCode: (code: string) => void;
  stores: Store[];
  addToast: (message: string, type?: Toast['type']) => void;
}

type AdminTab = 'products' | 'orders' | 'discounts';

const AdminPanelPage: React.FC<AdminPanelPageProps> = (props) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  
  const tabs: { id: AdminTab; name: string; icon: React.ComponentProps<typeof Icon>['name'] }[] = [
    { id: 'products', name: 'Products', icon: 'package' },
    { id: 'orders', name: 'Orders', icon: 'clipboard-list' },
    { id: 'discounts', name: 'Discounts', icon: 'tag' },
  ];

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
        <div className="flex items-center border-b border-glass-border">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-4 md:px-6 font-semibold transition-colors ${activeTab === tab.id ? 'text-accent border-b-2 border-accent' : 'text-text-secondary hover:text-text-primary'}`}
            >
              <Icon name={tab.icon} className="w-5 h-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
        
        <div className="p-4 md:p-6">
          {activeTab === 'products' && <ProductManagement {...props} onAddProductClick={() => setIsAddProductModalOpen(true)} />}
          {activeTab === 'orders' && <OrderManagement {...props} />}
          {activeTab === 'discounts' && <DiscountManagement {...props} addToast={props.addToast} />}
        </div>
      </div>
    </div>
    <AddProductModal isOpen={isAddProductModalOpen} onClose={() => setIsAddProductModalOpen(false)} onAddProduct={props.onAddProduct} stores={props.stores} addToast={props.addToast} />
    </>
  );
};

const ProductManagement = ({ allProducts, onAddProductClick }: { allProducts: Product[], onAddProductClick: () => void }) => (
  <div>
    <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Products ({allProducts.length})</h2>
        <button onClick={onAddProductClick} className="flex items-center gap-2 bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition-all duration-300">
            <Icon name="plus-circle" className="w-5 h-5" />
            Add Product
        </button>
    </div>
    <div className="overflow-x-auto bg-primary p-4 rounded-lg">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-glass-border">
            <th className="p-3">Product</th>
            <th className="p-3">Category</th>
            <th className="p-3">Price</th>
            <th className="p-3">Stock</th>
          </tr>
        </thead>
        <tbody>
          {allProducts.map(p => (
            <tr key={p.id} className="border-b border-glass-border last:border-none hover:bg-secondary/30">
              <td className="p-3 font-semibold">{p.name}</td>
              <td className="p-3 text-text-secondary">{p.category}</td>
              <td className="p-3">₹{p.price.toFixed(2)}</td>
              <td className="p-3">{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const OrderManagement = ({ allOrders, onUpdateOrderStatus }: { allOrders: Order[], onUpdateOrderStatus: (orderId: string, status: Order['status']) => void }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Manage Orders ({allOrders.length})</h2>
    <div className="space-y-4">
      {allOrders.map(order => (
        <div key={order.id} className="bg-primary p-4 rounded-lg border border-glass-border">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold">{order.id}</p>
              <p className="text-sm text-text-secondary">{order.userEmail} - {new Date(order.date).toLocaleDateString()}</p>
              <p className="text-sm text-text-secondary">Phone: {order.phone}</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-bold text-lg">₹{order.total.toFixed(2)}</p>
              <select 
                value={order.status}
                onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                className="p-2 rounded-lg bg-secondary border border-glass-border focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const DiscountManagement = ({ allDiscountCodes, onAddDiscountCode, onDeleteDiscountCode, addToast }: { allDiscountCodes: DiscountCode[], onAddDiscountCode: (code: DiscountCode) => void, onDeleteDiscountCode: (code: string) => void, addToast: (message: string, type?: Toast['type']) => void }) => {
    const [newCode, setNewCode] = useState('');
    const [newCodeType, setNewCodeType] = useState<'percentage' | 'fixed'>('percentage');
    const [newCodeValue, setNewCodeValue] = useState(0);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCode || newCodeValue <= 0) {
            addToast("Please fill out all fields for the discount code.", 'error');
            return;
        }
        onAddDiscountCode({ code: newCode.toUpperCase(), type: newCodeType, value: newCodeValue });
        setNewCode('');
        setNewCodeValue(0);
    }
    
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Manage Discount Codes</h2>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-primary p-4 rounded-lg border border-glass-border">
                <input type="text" value={newCode} onChange={e => setNewCode(e.target.value)} placeholder="Code Name (e.g. AURA15)" className="p-3 rounded-lg bg-secondary border border-glass-border focus:outline-none focus:ring-2 focus:ring-accent" />
                <select value={newCodeType} onChange={e => setNewCodeType(e.target.value as any)} className="p-3 rounded-lg bg-secondary border border-glass-border focus:outline-none focus:ring-2 focus:ring-accent">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                </select>
                <input type="number" value={newCodeValue} onChange={e => setNewCodeValue(parseFloat(e.target.value))} placeholder="Value" className="p-3 rounded-lg bg-secondary border border-glass-border focus:outline-none focus:ring-2 focus:ring-accent" />
                <button type="submit" className="bg-accent text-white font-bold rounded-lg hover:bg-opacity-80 transition-colors">Add Code</button>
            </form>
            <div className="space-y-2">
                {allDiscountCodes.map(code => (
                    <div key={code.code} className="bg-primary p-3 rounded-lg flex justify-between items-center border border-glass-border">
                        <div>
                            <p className="font-bold text-accent">{code.code}</p>
                            <p className="text-sm text-text-secondary">{code.type === 'percentage' ? `${code.value}% off` : `₹${code.value} off`}</p>
                        </div>
                        <button onClick={() => onDeleteDiscountCode(code.code)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full">
                            <Icon name="trash" className="w-5 h-5"/>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminPanelPage;