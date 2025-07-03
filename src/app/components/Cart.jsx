"use client";
import { useState, useEffect } from "react";
import { db, auth } from "../lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Cart() {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "cart"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCartItems(items);
    });

    return () => unsubscribe();
  }, [user]);

  const updateQuantity = async (itemId, delta) => {
    const item = cartItems.find((i) => i.id === itemId);
    if (!item) return;

    const newQty = Math.max(1, item.quantity + delta);
    try {
      await updateDoc(doc(db, "cart", itemId), { quantity: newQty });
    } catch (error) {
      console.error("Error actualizando cantidad:", error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await deleteDoc(doc(db, "cart", itemId));
    } catch (error) {
      console.error("Error eliminando producto del carrito:", error);
    }
  };

  const getTotal = () => {
    return cartItems.reduce(
      (acc, item) => acc + (item.price || 0) * item.quantity,
      0
    );
  };

  const handleCheckout = async () => {
  try {
    const response = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: cartItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      }),
    });

    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("No se pudo iniciar el pago.");
    }
  } catch (err) {
    console.error("Checkout error:", err);
    alert("Error en el checkout.");
  }
};


  if (!user) {
    return (
      <div className="p-4 text-center">
        <p className="text-lg text-gray-600">
          Inicia sesión para ver tu carrito
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl text-gray-700 font-bold mb-4">Tu Carrito</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Tu carrito está vacío.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="border p-4 rounded bg-white shadow flex gap-4 items-center"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-24 h-24 object-contain rounded border"
                />

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-800">
                    {item.name}
                  </h3>

                  <p className="text-sm text-gray-700 font-semibold">
                    S/. {item.price?.toFixed(2)} x unidad
                  </p>

                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="px-2 py-1 bg-gray-400 rounded hover:bg-gray-500 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-3 text-gray-700">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="px-2 py-1 bg-gray-400 rounded hover:bg-gray-500 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="px-3 py-2 bg-gray-900 text-white rounded hover:bg-gray-700 cursor-pointer"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>

          {/* Total del carrito */}
          <div className="mt-4 text-right text-lg text-gray-800 font-bold">
            Total: S/. {getTotal().toFixed(2)}
          </div>

          {/* Botón de checkout */}
          <div className="mt-6 text-right">
            <button
              onClick={handleCheckout}
              className="px-6 py-3 bg-red-900 text-white rounded hover:bg-red-700 transition font-semibold cursor-pointer flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 8.25h19.5M3 9h18m-15 5.25h6m-6 2.25h3m-4.5 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5z"
                />
              </svg>
              Ir a pagar
            </button>
          </div>
        </>
      )}
    </div>
  );
}
