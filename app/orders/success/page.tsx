
import OrderSuccessPage from '@/components/OrderSuccessPage';
import { getOrderById } from '@/services/firebaseService';
import { notFound } from 'next/navigation';

interface PageProps {
  searchParams?: { order_id?: string };
}

export default async function OrderSuccess({ searchParams }: PageProps) {
  const orderId = searchParams?.order_id;

  if (!orderId) {
    notFound();
  }

  const order = await getOrderById(orderId);

  if (!order) {
    notFound();
  }

  return <OrderSuccessPage order={order} />;
}
