"use client";
import { useEffect, useState } from "react";
import { db, auth } from "@/app/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function SuccessPage() {
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.warn("⚠️ No hay usuario logueado todavía.");
        return;
      }

      try {
        const q = query(collection(db, "cart"), where("userId", "==", user.uid));
        const snapshot = await getDocs(q);

        console.log("🛒 Productos en el carrito:", snapshot.docs.length);

        const items = snapshot.docs.map((doc) => ({
          name: doc.data().name,
          quantity: doc.data().quantity,
          price: doc.data().price,
        }));

        const total = items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );

        await fetch("/api/send-confirmation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            name: user.displayName || "Cliente",
            items,
            total,
          }),
        });

        const deletions = snapshot.docs.map((doc) => deleteDoc(doc.ref));
        await Promise.all(deletions);

        console.log("✅ Carrito limpiado tras el pago.");
        setCleared(true);
      } catch (err) {
        console.error("❌ Error al limpiar el carrito o enviar correo:", err);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white px-6 py-12 text-center">
      <div className="max-w-lg w-full bg-green-50 border border-green-200 rounded-xl p-8 shadow-md">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            ¡Gracias por tu compra! 🎉
          </h1>
          <p className="text-green-700 text-base">
            Hemos recibido tu pago correctamente. En breve recibirás un correo con la confirmación de tu pedido.
          </p>
        </div>

        <div className="text-left text-green-700 text-sm space-y-2 border-t border-green-200 pt-4">
          <p>✅ Transacción completada con éxito.</p>
          <p>🛍️ Los productos adquiridos serán procesados.</p>
          <p>📧 Se enviará un comprobante a tu correo.</p>
          <p>🧹 {cleared ? "Tu carrito ha sido vaciado automáticamente." : "Procesando limpieza del carrito..."}</p>
        </div>

        <div className="mt-6">
          <a
            href="/"
            className="inline-block px-6 py-3 bg-green-700 text-white rounded hover:bg-green-800 transition font-medium"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
}
