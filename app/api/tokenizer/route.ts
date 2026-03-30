import Midtrans from 'midtrans-client';
import { NextResponse } from 'next/server';

let snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ''
});

export async function POST(request: Request) {
  const { id, title, price, totalBill } = await request.json();

  let parameter = {
    transaction_details: {
      order_id: `INV-${Date.now()}-${id}`,
      gross_amount: totalBill,
    },
    item_details: [
      {
        id: id,
        price: price,
        quantity: 1,
        name: title,
      },
      {
        id: 'SERVICE_FEE',
        price: (price * 0.04) + 1000,
        quantity: 1,
        name: 'Biaya Layanan (4% + 1000)',
      }
    ],
  };

  const token = await snap.createTransactionToken(parameter);
  return NextResponse.json({ token });
}