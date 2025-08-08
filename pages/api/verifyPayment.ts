import type { NextApiRequest, NextApiResponse } from 'next';
import * as crypto from 'crypto';
import { db } from '../../lib/firebaseAdmin';

// Helper to set CORS headers for PayU's webhook requests.
const allowCors = (fn: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) => async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins for the webhook
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
    }
    return await fn(req, res);
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
  
  const PAYU_KEY = process.env.PAYU_KEY;
  const PAYU_SALT = process.env.PAYU_SALT;

  const { status, txnid, hash, email, firstname, productinfo, amount } = req.body;
  console.log(`Received webhook for txnid: ${txnid} with status: ${status}`);

  if (!status || !txnid || !hash || !email || !firstname || !productinfo || !amount || !PAYU_KEY || !PAYU_SALT) {
    console.error("Webhook missing required fields or server config.", { body: req.body });
    return res.status(400).send("Invalid request: missing fields.");
  }

  // --- Hash Verification ---
  // Re-calculate the hash on the server to verify the request's integrity.
  const hashString = `${PAYU_SALT}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${PAYU_KEY}`;
  const recomputedHash = crypto.createHash("sha512").update(hashString).digest("hex");

  if (recomputedHash !== hash) {
    console.error(`Hash mismatch for txnid: ${txnid}. Potential fraud attempt.`);
    // Log the failure but don't update the order to avoid malicious updates.
    return res.status(400).send("Hash verification failed.");
  }

  // --- Update Order Status in Firestore ---
  try {
    const orderRef = db.collection("orders").doc(txnid);
    const doc = await orderRef.get();
    
    if (!doc.exists) {
        console.error(`Order with txnid: ${txnid} not found.`);
        return res.status(404).send("Order not found.");
    }
    
    if (status === "success") {
      await orderRef.update({ status: "Processing" });
      console.log(`Order ${txnid} successfully updated to Processing.`);
    } else {
      await orderRef.update({ status: "Cancelled", notes: `Payment ${status} by user.` });
      console.warn(`Order ${txnid} marked as Cancelled due to status: ${status}.`);
    }
    return res.status(200).send("Webhook processed successfully.");
  } catch (error) {
    console.error(`Failed to update Firestore for txnid: ${txnid}`, error);
    return res.status(500).send("Error updating order status.");
  }
}

export default allowCors(handler);
