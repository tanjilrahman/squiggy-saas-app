"use client";

import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";

function CheckoutButton() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const createCheckoutSession = async () => {
    if (!user) return;

    // push a document into firestore db
    setLoading(true);

    // const docRef = await addDoc(collection(db, "customers", session.user.id, 'checkout_sessions'), {
    //     price: 'price_fasdlfjleihr',
    //     success_url: window.location.origin,
    //     cancel_url: window.location.origin
    // })
    // ... stripe extension on firebase will create a checkout session

    // redirect user to checkout page
  };

  return (
    <div className="flex flex-col space">
      <button
        onClick={() => createCheckoutSession()}
        className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-indigo-900"
      >
        Checkout
      </button>
    </div>
  );
}

export default CheckoutButton;
