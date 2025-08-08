
import React, { useState } from 'react';
import { Product, Store, Toast } from '../types';
import Icon from './Icon';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  stores: Store[];
  addToast: (message: string, type?: Toast['type']) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onAddProduct, stores, addToast }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [imageUrls, setImageUrls] = useState('');
  const [category, setCategory] = useState('Face Care');
  const [stock, setStock] = useState(0);
  const [storeId, setStoreId] = useState<number | ''>(stores.length > 0 ? stores[0].id : '');


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || price <= 0 || !imageUrls || !category || stock < 0 || storeId === '') {
      addToast('Please fill out all fields correctly.', 'error');
      return;
    }
    onAddProduct({
      storeId: Number(storeId),
      name,
      description,
      price,
      imageUrls: imageUrls.split(',').map(url => url.trim()),
      category,
      stock,
    });
    onClose();
    // Reset form
    setName('');
    setDescription('');
    setPrice(0);
    setImageUrls('');
    setCategory('Face Care');
    setStock(0);
    setStoreId(stores.length > 0 ? stores[0].id : '');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-secondary text-text-primary rounded-2xl shadow-2xl w-full max-w-2xl m-4 max-h-[90vh] flex flex-col transform transition-transform duration-300 scale-95 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-glass-border">
          <h2 className="text-2xl font-serif font-bold">Add New Product</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Product Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 rounded-lg bg-primary border border-glass-border focus:outline-none focus:ring-2 focus:ring-accent" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 rounded-lg bg-primary border border-glass-border focus:outline-none focus:ring-2 focus:ring-accent" rows={3} required></textarea>
            </div>
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Image URLs (comma-separated)</label>
                <input type="text" value={imageUrls} onChange={e => setImageUrls(e.target.value)} className="w-full p-3 rounded-lg bg-primary border border-glass-border focus:outline-none focus:ring-2 focus:ring-accent" placeholder="https://.../img1.jpg, https://.../img2.jpg" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Price (₹)</label>
                    <input type="number" step="0.01" value={price} onChange={e => setPrice(parseFloat(e.target.value))} className="w-full p-3 rounded-lg bg-primary border border-glass-border focus:outline-none focus:ring-2 focus:ring-accent" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-3 rounded-lg bg-primary border border-glass-border focus:outline-none focus:ring-2 focus:ring-accent" required>
                        <option>Face Care</option>
                        <option>Body Care</option>
                        <option>Hair Care</option>
                        <option>Tools</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Stock Quantity</label>
                    <input type="number" value={stock} onChange={e => setStock(parseInt(e.target.value, 10))} className="w-full p-3 rounded-lg bg-primary border border-glass-border focus:outline-none focus:ring-2 focus:ring-accent" required />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Store</label>
                <select value={storeId} onChange={e => setStoreId(Number(e.target.value))} className="w-full p-3 rounded-lg bg-primary border border-glass-border focus:outline-none focus:ring-2 focus:ring-accent" required>
                    {stores.map(store => (
                        <option key={store.id} value={store.id}>{store.name}</option>
                    ))}
                </select>
            </div>
            <div className="pt-4 flex justify-end gap-4">
                <button type="button" onClick={onClose} className="bg-primary text-text-primary font-bold py-2 px-6 rounded-lg border border-glass-border hover:bg-black/10 dark:hover:bg-white/10">Cancel</button>
                <button type="submit" className="bg-accent text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-80">Add Product</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;