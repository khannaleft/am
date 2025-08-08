
import React, { useState, useEffect } from 'react';
import { Offer } from '../types';
import Icon from './Icon';

interface AddEditOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (offerData: Omit<Offer, 'id'>, offerId?: string) => Promise<void>;
  offerToEdit?: Offer | null;
}

const AddEditOfferModal: React.FC<AddEditOfferModalProps> = ({ isOpen, onClose, onSave, offerToEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaLink, setCtaLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (offerToEdit) {
        setTitle(offerToEdit.title);
        setDescription(offerToEdit.description);
        setImageUrl(offerToEdit.imageUrl);
        setCtaText(offerToEdit.ctaText);
        setCtaLink(offerToEdit.ctaLink);
      } else {
        setTitle('');
        setDescription('');
        setImageUrl('');
        setCtaText('');
        setCtaLink('');
      }
      setIsSubmitting(false);
    }
  }, [isOpen, offerToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({ title, description, imageUrl, ctaText, ctaLink }, offerToEdit?.id);
      onClose();
    } catch (error) {
      console.error("Failed to save offer", error);
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
          <h2 className="text-2xl font-serif font-bold">{offerToEdit ? 'Edit Offer' : 'Add New Offer'}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10" disabled={isSubmitting}>
            <Icon name="close" className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 rounded-lg bg-primary border border-glass-border focus:outline-none focus:ring-2 focus:ring-accent" required disabled={isSubmitting} />
            </div>
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 rounded-lg bg-primary border border-glass-border focus:outline-none focus:ring-2 focus:ring-accent" rows={3} required disabled={isSubmitting}></textarea>
            </div>
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Image URL</label>
                <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full p-3 rounded-lg bg-primary border border-glass-border focus:outline-none focus:ring-2 focus:ring-accent" placeholder="https://images.unsplash.com/..." required disabled={isSubmitting} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">CTA Button Text</label>
                    <input type="text" value={ctaText} onChange={e => setCtaText(e.target.value)} placeholder="e.g., Shop Now" className="w-full p-3 rounded-lg bg-primary border border-glass-border focus:outline-none focus:ring-2 focus:ring-accent" required disabled={isSubmitting} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">CTA Link</label>
                    <input type="text" value={ctaLink} onChange={e => setCtaLink(e.target.value)} placeholder="e.g., /aura-downtown" className="w-full p-3 rounded-lg bg-primary border border-glass-border focus:outline-none focus:ring-2 focus:ring-accent" required disabled={isSubmitting} />
                </div>
            </div>
            <div className="pt-4 flex justify-end gap-4 border-t border-glass-border">
                <button type="button" onClick={onClose} className="bg-primary text-text-primary font-bold py-2.5 px-6 rounded-lg border border-glass-border hover:bg-black/10 dark:hover:bg-white/10 transition-colors" disabled={isSubmitting}>Cancel</button>
                <button type="submit" className="bg-accent text-white font-bold py-2.5 px-6 rounded-lg hover:bg-opacity-80 transition-opacity disabled:bg-gray-400 disabled:cursor-wait" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Offer'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditOfferModal;