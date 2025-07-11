"use client";
import { useState, useEffect } from "react";
import { questions } from "../lib/questions";
import { products } from "../lib/products";
import { db, auth } from "../lib/firebase";
import {
  collection,
  addDoc,
  Timestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Login from "./Login";

export default function TestApplication() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [user, setUser] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleAnswer = (questionId, skinType) => {
    const updatedAnswers = { ...answers, [questionId]: skinType };
    setAnswers(updatedAnswers);

    if (currentStep + 1 < questions.length) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateResult(updatedAnswers);
    }
  };

  const calculateResult = async (answers) => {
    const counter = {};
    Object.values(answers).forEach((type) => {
      counter[type] = (counter[type] || 0) + 1;
    });
    const final = Object.entries(counter).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0];

    try {
      await addDoc(collection(db, "results"), {
        userId: user?.uid || "anon",
        name: user?.displayName || "Anónimo",
        email: user?.email || "anon",
        skinType: final,
        answers,
        timestamp: Timestamp.now(),
      });
      setResult(final);

      const recommended = getRecommendedProducts(final);
      const initialTotal = recommended.reduce((acc, prod) => {
        const qty = quantities[prod.id] || 1;
        return acc + prod.price * qty;
      }, 0);
      setTotalPrice(initialTotal);
    } catch (error) {
      console.error("Error al guardar en Firestore:", error);
    }
  };

  const getRecommendedProducts = (skinType) => {
    return products.filter((p) => p.skinTypes.includes(skinType));
  };

  const handleQuantityChange = (productId, delta) => {
    setQuantities((prev) => {
      const newQty = Math.max(1, (prev[productId] || 1) + delta);
      const newQuantities = { ...prev, [productId]: newQty };

      if (result) {
        const recommended = getRecommendedProducts(result);
        const newTotal = recommended.reduce((acc, prod) => {
          const qty = newQuantities[prod.id] || 1;
          return acc + prod.price * qty;
        }, 0);
        setTotalPrice(newTotal);
      }

      return newQuantities;
    });
  };

  const handleAddToCart = async (product) => {
    const quantity = quantities[product.id] || 1;
    if (!user) return;

    try {
      const cartItemRef = doc(db, "cart", `${user.uid}_${product.id}`);
      await setDoc(cartItemRef, {
        userId: user.uid,
        productId: product.id,
        name: product.name,
        img: product.img,
        quantity,
        price: product.price,
        addedAt: Timestamp.now(),
      });
      console.log("Producto agregado al carrito:", product.name);
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
    }
  };

  if (!user) {
    return (
      <div className="relative w-full h-screen overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src="/videos/background.mp4" type="video/mp4" />
          Tu navegador no soporta videos HTML5.
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />
        <div className="relative z-20 flex flex-col items-center justify-center w-full h-full px-4">
          <h2 className="text-xl font-semibold text-white mb-4 text-center">
            Inicia sesión para realizar el test
          </h2>
          <div className="w-full max-w-sm">
            <Login onSuccess={() => setUser(auth.currentUser)} />
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    const recommended = getRecommendedProducts(result);

    return (
      <div className="p-4 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-green-700 mb-4">
          ¡Test Completado!
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          Tu tipo de piel es:{" "}
          <strong className="capitalize">{result}</strong>
        </p>

        <h3 className="text-xl text-gray-500 font-semibold mb-2">
          Productos Recomendados:
        </h3>
        <div className="space-y-4">
          {recommended.map((prod) => (
            <div
              key={prod.id}
              className="border p-4 rounded shadow-sm bg-white space-y-2"
            >
              <h4 className="text-lg text-red-900 font-bold">{prod.name}</h4>

              <img
                src={prod.img}
                alt={prod.name}
                className="w-full h-48 object-contain rounded border"
              />

              <p className="text-sm text-gray-600">{prod.description}</p>
              <p className="text-xl text-red-800 font-semibold">
                S/. {prod.price.toFixed(2)}
              </p>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(prod.id, -1)}
                  className="px-2 py-1 bg-gray-400 rounded hover:bg-gray-500"
                >
                  -
                </button>
                <span className="px-3 text-gray-400">
                  {quantities[prod.id] || 1}
                </span>
                <button
                  onClick={() => handleQuantityChange(prod.id, 1)}
                  className="px-2 py-1 bg-gray-400 rounded hover:bg-gray-500"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => handleAddToCart(prod)}
                className="mt-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-red-800 cursor-pointer"
              >
                Añadir al carrito
              </button>
            </div>
          ))}
          <p className="text-xl text-gray-800 font-bold text-right mt-4">
            Total: S/. {totalPrice.toFixed(2)}
          </p>
        </div>
      </div>
    );
  }

  const question = questions[currentStep];

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl text-gray-700 font-semibold mb-4">
        Pregunta {currentStep + 1} de {questions.length}
      </h2>
      <p className="text-lg text-gray-500 mb-4">{question.question}</p>
      <div className="space-y-2">
        {question.options.map((opt, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(question.id, opt.value)}
            className="block w-full px-4 py-2 bg-red-900 hover:bg-red-700 text-white text-left rounded cursor-pointer"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
