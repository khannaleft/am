
import React, { useState } from 'react';
import { Offer } from '../types';
import Icon from './Icon';
import AddEditOfferModal from './AddEditOfferModal';
import Image from 'next/image';

interface OfferManagementProps {
  offers: Offer[];
  onAddOffer: (offerData: Omit<Offer, 'id'>) => Promise<void>;
  onUpdateOffer: (offerId: string, offerData: Partial<Omit<Offer, 'id'>>) => Promise<void>;
  onDeleteOffer: (offerId: string) => Promise<void>;
}

const OfferManagement: React.FC<OfferManagementProps> = ({ offers, onAddOffer, onUpdateOffer, onDeleteOffer }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  const handleOpenAddModal = () => {
    setEditingOffer(null);
    setIsModalOpen(true);
  };
  
  const handleOpenEditModal = (offer: Offer) => {
    setEditingOffer(offer);
    setIsModalOpen(true);
  };

  const handleSave = async (offerData: Omit<Offer, 'id'>, offerId?: string) => {
    if (offerId) {
      await onUpdateOffer(offerId, offerData);
    } else {
      await onAddOffer(offerData);
    }
  };
  
  const handleDelete = (offerId: string) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
        onDeleteOffer(offerId);
    }
  }

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Manage Carousel Offers ({offers.length})</h2>
          <button onClick={handleOpenAddModal} className="flex items-center gap-2 bg-accent text-white font-bold py-2 px-4 rounded-lg hover:opacity-80 transition-all duration-300">
            <Icon name="plus-circle" className="w-5 h-5" />
            Add Offer
          </button>
        </div>
        <div className="space-y-4">
          {offers.length > 0 ? offers.map(offer => (
             <div key={offer.id} className="bg-primary p-4 rounded-xl border border-glass-border flex flex-col md:flex-row items-start gap-4">
                <div className="relative w-full md:w-48 h-32 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={offer.imageUrl} alt={offer.title} layout="fill" objectFit="cover" />
                </div>
                <div className="flex-grow">
                    <h3 className="font-bold text-lg">{offer.title}</h3>
                    <p className="text-sm text-text-secondary line-clamp-2">{offer.description}</p>
                    <div className="text-xs mt-2 space-x-4">
                        <span className="font-semibold">Button: <span className="text-accent">{offer.ctaText}</span></span>
                        <span className="font-semibold">Link: <span className="text-accent">{offer.ctaLink}</span></span>
                    </div>
                </div>
                <div className="flex gap-2 self-start md:self-center">
                    <button onClick={() => handleOpenEditModal(offer)} className="p-2 rounded-lg bg-secondary hover:bg-primary border border-glass-border">
                        <Icon name="pencil" className="w-5 h-5 text-text-secondary"/>
                    </button>
                    <button onClick={() => handleDelete(offer.id)} className="p-2 rounded-lg bg-secondary hover:bg-red-500/10 border border-glass-border">
                        <Icon name="trash" className="w-5 h-5 text-red-500"/>
                    </button>
                </div>
             </div>
          )) : (
            <p className="text-center py-8 text-text-secondary">No offers have been created yet.</p>
          )}
        </div>
      </div>
      <AddEditOfferModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave} 
        offerToEdit={editingOffer} 
      />
    </>
  );
};

export default OfferManagement;
