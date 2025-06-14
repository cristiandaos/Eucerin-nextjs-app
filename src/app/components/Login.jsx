"use client";
import { useState } from "react";
import { auth, provider, db } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";

export default function Login({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

  const saveUserToFirestore = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) {
      await setDoc(userRef, {
        userId: user.uid,
        name: user.displayName || "",
        email: user.email || "",
        createdAt: new Date(),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let userCredential;
      if (isRegister) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
          displayName: `${firstName} ${lastName}`,
        });
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }

      await saveUserToFirestore(userCredential.user);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      if (!result.user.displayName) {
        await updateProfile(result.user, { displayName: "Usuario Google" });
      }
      await saveUserToFirestore(result.user);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  return (

    <div className="p-4 max-w-sm mx-auto bg-white rounded shadow space-y-4">
      <h2 className="text-xl text-gray-600 font-bold">{isRegister ? "Crear cuenta" : "Iniciar sesión"}</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {isRegister && (
          <>
            <input
              type="text"
              placeholder="Nombres"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full border text-gray-600 px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Apellidos"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full border text-gray-600 px-3 py-2 rounded"
            />
          </>
        )}
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border text-gray-600 px-3 py-2 rounded"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border text-gray-600 px-3 py-2 rounded"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" className="w-full bg-red-800 hover:bg-red-700 text-white py-2 rounded cursor-pointer">
          {isRegister ? "Registrarse" : "Ingresar"}
        </button>
        <p
          onClick={() => setIsRegister(!isRegister)}
          className="text-sm text-center text-blue-600 hover:text-blue-500 cursor-pointer"
        >
          {isRegister ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}
        </p>
      </form>

      <div className="text-center text-gray-500">o</div>

      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded cursor-pointer"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          className="w-5 h-5"
        />
        Iniciar sesión con Google
      </button>
    </div>
  );
}
