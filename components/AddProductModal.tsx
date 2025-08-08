
import React, { useState, useEffect } from 'react';
import { Product, Store, Toast } from '../types';
import Icon from './Icon';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  stores: Store[];
  addToast: (message: string, type?: Toast['type']) => void;
  categories: string[];
  onAddCategory: (category: string) => Promise<void>;
  lockedStoreId?: number;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ 
    isOpen, 
    onClose, 
    onAddProduct, 
    stores, 
    addToast, 
    categories, 
    onAddCategory, 
    lockedStoreId 
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [imageUrls, setImageUrls] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [stock, setStock] = useState(10);
  const [storeId, setStoreId] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
        setName('');
        setDescription('');
        setPrice(0);
        setImageUrls('');
        setCategory(categories.length > 0 ? categories[0] : '--add-new--');
        setNewCategory('');
        setStock(10);
        setStoreId(lockedStoreId || (stores.length > 0 ? stores[0].id : ''));
        setIsSubmitting(false);
    }
  }, [isOpen, categories, stores, lockedStoreId]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let finalCategory = category;
    if (category === '--add-new--') {
        if (!newCategory.trim()) {
            addToast('Please enter a name for the new category.', 'error');
            setIsSubmitting(false);
            return;
        }
        finalCategory = newCategory.trim();
        // Check if category already exists (case-insensitive)
        const existingCategory = categories.find(c => c.toLowerCase() === finalCategory.toLowerCase());
        if (!existingCategory) {
            try {
                await onAddCategory(finalCategory);
            } catch (error) {
                 addToast('Failed to add new category.', 'error');
                 setIsSubmitting(false);
                 return;
            }
        } else {
            finalCategory = existingCategory; // Use the existing cased category name
        }
    }

    if (!name || !description || price <= 0 || !imageUrls || !finalCategory || stock < 0 || storeId === '') {
      addToast('Please fill out all fields correctly.', 'error');
      setIsSubmitting(false);
      return;
    }

    try {
        await onAddProduct({
          storeId: Number(storeId),
          name,
          description,
          price,
          imageUrls: imageUrls.split(',').map(url => url.trim()).filter(url => url),
          category: finalCategory,
          stock,
        });
        onClose();
    } catch (error) {
        addToast('Failed to add product.', 'error');
    } finally {
        setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-secondary text-text-primary rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-transform duration-300 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-glass-border flex-shrink-0">
          <h2 className="text-2xl font-serif font-bold">Add New Product</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10" disabled={isSubmitting}>
            <Icon name="close" className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Product Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 rounded-lg bg-primary border border-glass-border focus:outline-none focus:ring-2 focus:ring-accent" required disabled={isSubmitting} />
            </div>
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 rounded-lg bg-primary border border-glass-border focus:outline-none focus:ring-2 focus:ring-accent" rows={3} required disabled={isSubmitting}></textarea>
            </div>
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Image URLs (comma-separated)</label>
                <input type="text" value={imageUrls} onChange={e => setImageUrls(e.target.value)} className="w-full p-3 rounded-lg bg-primary border border-glass-border focus:outline-none focus:ring-2 focus:ring-accent" placeholder="https://.../img1.jpg, https://.../img2.jpg" required disabled={isSubmitting} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Price (₹)</label>
                    <input type="number" step="0.01" value={price} onChange={e => setPrice(parseFloat(e.target.value) || 0)} className="w-full p-3 rounded-lg bg-primary border border-glass-border focus:outline-none focus:ring-2 focus:ring-accent" required disabled={isSubmitting} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Stock Quantity</label>
                    <input type="number" value={stock} onChange={e => setStock(parseInt(e.target.value, 10) || 0)} className="w-full p-3 rounded-lg bg-primary border border-glass-border focus:outline-none focus:ring-2 focus:ring-accent" required disabled={isSubmitting} />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-3 rounded-lg bg-primary border border-glass-border focus:outline-none focus:ring-2 focus:ring-accent capitalize" required disabled={isSubmitting}>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        <option value="--add-new--">Add new category...</option>
                    </select>
                </div>
                {category === '--add-new--' && (
                     <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">New Category Name</label>
                        <input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} className="w-full p-3 rounded-lg bg-primary border border-glass-border focus:outline-none focus:ring-2 focus:ring-accent" required={category === '--add-new--'} disabled={isSubmitting} />
                    </div>
                )}
            </div>
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Store</label>
                <select value={storeId} onChange={e => setStoreId(Number(e.target.value))} className="w-full p-3 rounded-lg bg-primary border border-glass-border focus:outline-none focus:ring-2 focus:ring-accent" required disabled={!!lockedStoreId || isSubmitting}>
                    {stores.map(store => (
                        <option key={store.id} value={store.id}>{store.name}</option>
                    ))}
                </select>
            </div>
            <div className="pt-4 flex justify-end gap-4 border-t border-glass-border">
                <button type="button" onClick={onClose} className="bg-primary text-text-primary font-bold py-2.5 px-6 rounded-lg border border-glass-border hover:bg-black/10 dark:hover:bg-white/10 transition-colors" disabled={isSubmitting}>Cancel</button>
                <button type="submit" className="bg-accent text-white font-bold py-2.5 px-6 rounded-lg hover:bg-opacity-80 transition-opacity disabled:bg-gray-400 disabled:cursor-wait" disabled={isSubmitting}>
                    {isSubmitting ? 'Adding...' : 'Add Product'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
