"use client";
import { useState, useEffect } from "react";
import { questions } from "../lib/questions";
import { products } from "../lib/products";
import { db, auth } from "../lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Login from "./Login";

export default function TestApplication() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [user, setUser] = useState(null);

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
    } catch (error) {
      console.error("Error al guardar en Firestore:", error);
    }
  };

  const getRecommendedProducts = (skinType) => {
    return products.filter((p) => p.skinTypes.includes(skinType));
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
          Tu tipo de piel es: <strong className="capitalize">{result}</strong>
        </p>

        <h3 className="text-xl text-gray-500 font-semibold mb-2">
          Productos Recomendados:
        </h3>
        <div className="space-y-4">
          {recommended.map((prod) => (
            <div
              key={prod.id}
              className="border p-4 rounded shadow-sm bg-white"
            >
              <h4 className="text-lg text-red-900 font-bold">{prod.name}</h4>
              <p className="text-sm text-gray-600">{prod.description}</p>
              {/* Btn para Añadir a Carrito */}
            </div>
          ))}
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
