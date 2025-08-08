
// firebase.ts - Using Firebase v10+ modular SDK.

import { initializeApp, getApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User as FirebaseAuthUser
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  writeBatch, 
  runTransaction, 
  query, 
  limit,
  arrayUnion
} from 'firebase/firestore';

import { Product, Store, Order, DiscountCode, User, Offer } from '@/types';

const firebaseConfig = {
  apiKey: "AIzaSyCQ_SeHByThTTU9VLdNYnG3NDSOgUCFZI8",
  authDomain: "aurakhanna-6f423.firebaseapp.com",
  projectId: "aurakhanna-6f423",
  storageBucket: "aurakhanna-6f423.appspot.com",
  messagingSenderId: "146980316085",
  appId: "1:146980316085:web:15761d0ed6f6c5b222affc",
  measurementId: "G-SR4YRSXW95"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export type FirebaseUser = FirebaseAuthUser;

export {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
};

// --- MOCK DATA ---
const mockStores: Store[] = [
  { id: 1, name: 'Aura - Downtown', slug: 'aura-downtown', location: '123 Main St, Anytown, USA', bannerUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=2500&auto=format&fit=crop', latitude: 34.0522, longitude: -118.2437 },
  { id: 2, name: 'Aura - Beachside', slug: 'aura-beachside', location: '456 Ocean Ave, Beachtown, USA', bannerUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2000&auto=format&fit=crop', latitude: 33.9934, longitude: -118.4763 }
];

const mockProducts: Product[] = [];

const mockDiscountCodes: DiscountCode[] = [
  { code: 'AURA10', type: 'percentage', value: 10 },
  { code: 'WELCOME15', type: 'percentage', value: 15 }
];

const mockCategories: string[] = ['Face Care', 'Body Care', 'Hair Care', 'Tools'];

const mockOffers: Omit<Offer, 'id'>[] = [
  {
    title: 'First Purchase, 15% Off',
    description: 'Begin your journey with Aura and enjoy a special discount on your first order. Use code AURA15.',
    imageUrl: 'https://images.unsplash.com/photo-1598454449072-3544a3fb3af8?q=80&w=2574&auto=format&fit=crop',
    ctaText: 'Shop Face Care',
    ctaLink: '/aura-downtown' 
  },
  {
    title: 'Free Shipping Over ₹5000',
    description: 'Indulge in our complete collection and we\'ll deliver it to your doorstep, on us.',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=2564&auto=format&fit=crop',
    ctaText: 'Explore All Products',
    ctaLink: '/aura-beachside'
  },
  {
    title: 'New! The Serenity Body Oil',
    description: 'Discover our latest creation, a calming blend of lavender and chamomile for ultimate relaxation.',
    imageUrl: 'https://images.unsplash.com/photo-1563237023-b1e970526dcb?q=80&w=2574&auto=format&fit=crop',
    ctaText: 'Discover Now',
    ctaLink: '/aura-downtown'
  },
];


// --- SEED DATA ---
export const seedData = async () => {
  try {
    const batch = writeBatch(db);
    let needsCommit = false;

    // Seed categories
    const categoriesDoc = await getDoc(doc(db, 'product_categories', 'all'));
    if (!categoriesDoc.exists()) {
        console.log("Seeding categories...");
        batch.set(doc(db, 'product_categories', 'all'), { names: mockCategories });
        needsCommit = true;
    }

    // Seed products
    const productsQuery = query(collection(db, 'products'), limit(1));
    const productsSnapshot = await getDocs(productsQuery);
    if (productsSnapshot.empty) {
        console.log("Seeding products...");
        mockProducts.forEach(product => {
            const ref = doc(db, 'products', product.id.toString());
            batch.set(ref, product);
        });
        needsCommit = true;
    }
    
    // Seed stores
    const storesQuery = query(collection(db, 'stores'), limit(1));
    const storesSnapshot = await getDocs(storesQuery);
    if (storesSnapshot.empty) {
        console.log("Seeding stores...");
        mockStores.forEach(store => {
            const ref = doc(db, 'stores', store.id.toString());
            batch.set(ref, store);
        });
        needsCommit = true;
    }

    // Seed discount codes
    const discountsQuery = query(collection(db, 'discountCodes'), limit(1));
    const discountsSnapshot = await getDocs(discountsQuery);
    if (discountsSnapshot.empty) {
        console.log("Seeding discount codes...");
        mockDiscountCodes.forEach(code => {
            const ref = doc(db, 'discountCodes', code.code);
            batch.set(ref, code);
        });
        needsCommit = true;
    }

    // Seed offers
    const offersQuery = query(collection(db, 'offers'), limit(1));
    const offersSnapshot = await getDocs(offersQuery);
    if (offersSnapshot.empty) {
        console.log("Seeding offers...");
        mockOffers.forEach(offer => {
            const ref = doc(collection(db, 'offers'));
            batch.set(ref, offer);
        });
        needsCommit = true;
    }

    if (needsCommit) {
      console.log("Committing seed data to Firestore...");
      await batch.commit();
      console.log("Seeding complete.");
    }
  } catch (err) {
    console.error('Seeding error:', err);
  }
};

// --- FETCH FUNCTIONS ---
export const getStores = async (): Promise<Store[]> => {
  const snap = await getDocs(collection(db, 'stores'));
  return snap.docs.map(doc => doc.data() as Store);
};

export const getProducts = async (): Promise<Product[]> => {
  const snap = await getDocs(collection(db, 'products'));
  return snap.docs.map(doc => doc.data() as Product);
};

export const getDiscountCodes = async (): Promise<DiscountCode[]> => {
  const snap = await getDocs(collection(db, 'discountCodes'));
  return snap.docs.map(doc => doc.data() as DiscountCode);
};

export const getOrders = async (): Promise<Order[]> => {
  const snap = await getDocs(collection(db, 'orders'));
  return snap.docs.map(docSnap => ({ ...docSnap.data(), id: docSnap.id }) as Order);
};

export const getCategories = async (): Promise<string[]> => {
    const docRef = doc(db, 'product_categories', 'all');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        // Ensure it's sorted alphabetically
        return (data.names as string[]).sort((a, b) => a.localeCompare(b));
    }
    return [];
};

export const getOffers = async (): Promise<Offer[]> => {
  const snap = await getDocs(collection(db, 'offers'));
  return snap.docs.map(docSnap => ({ ...docSnap.data(), id: docSnap.id }) as Offer);
};


// --- USER PROFILE ---
export const getUserProfile = async (uid: string): Promise<User | null> => {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as User) : null;
};

export const createUserProfile = async (user: FirebaseUser, name?: string): Promise<User> => {
  const newUser: User = {
    uid: user.uid,
    name: name || user.displayName || 'Aura User',
    email: user.email!,
    role: 'customer',
  };
  await setDoc(doc(db, 'users', user.uid), newUser);
  return newUser;
};

// --- MUTATION FUNCTIONS ---
export const placeOrder = async (orderData: Omit<Order, 'id'>): Promise<string> => {
    let orderId = '';
    await runTransaction(db, async (transaction) => {
        const isPendingPayment = orderData.status === 'Pending Payment';
        
        const orderRef = doc(collection(db, "orders"));
        orderId = orderRef.id;

        if (!isPendingPayment) {
            const productReads = orderData.items.map(item => {
                const productRef = doc(db, 'products', item.id.toString());
                return transaction.get(productRef).then(productSnap => ({
                    productSnap,
                    item,
                    productRef
                }));
            });

            const productDetails = await Promise.all(productReads);

            for (const { productSnap, item, productRef } of productDetails) {
                if (!productSnap.exists()) throw new Error(`Product ${item.name} could not be found.`);
                const productData = productSnap.data() as Product;
                const newStock = productData.stock - item.quantity;
                if (newStock < 0) throw new Error(`Not enough stock for ${productData.name}.`);
                transaction.update(productRef, { stock: newStock });
            }
        }
        
        transaction.set(orderRef, { ...orderData, id: orderId });
    });
    return orderId;
};

export const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const newId = Date.now();
  const newProduct = { ...product, id: newId };
  await setDoc(doc(db, 'products', newId.toString()), newProduct);
  return newProduct;
};

export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<void> => {
  await updateDoc(doc(db, 'orders', orderId), { status });
};

export const updateProductStock = async (productId: number, stock: number): Promise<void> => {
  await updateDoc(doc(db, 'products', productId.toString()), { stock });
};

export const updateStore = async (storeId: number, updated: Partial<Store>): Promise<void> => {
  await updateDoc(doc(db, 'stores', storeId.toString()), updated);
};

export const addDiscountCode = async (code: DiscountCode): Promise<void> => {
  await setDoc(doc(db, 'discountCodes', code.code), code);
};

export const deleteDiscountCode = async (code: string): Promise<void> => {
  await deleteDoc(doc(db, 'discountCodes', code));
};

export const addCategory = async (categoryName: string): Promise<void> => {
    const categoryRef = doc(db, "product_categories", "all");
    await updateDoc(categoryRef, {
        names: arrayUnion(categoryName)
    });
};

export const addOffer = async (offerData: Omit<Offer, 'id'>): Promise<Offer> => {
    const newDocRef = doc(collection(db, "offers"));
    await setDoc(newDocRef, offerData);
    return { ...offerData, id: newDocRef.id };
};

export const updateOffer = async (offerId: string, offerData: Partial<Omit<Offer, 'id'>>): Promise<void> => {
    await updateDoc(doc(db, "offers", offerId), offerData);
};

export const deleteOffer = async (offerId: string): Promise<void> => {
    await deleteDoc(doc(db, "offers", offerId));
};
