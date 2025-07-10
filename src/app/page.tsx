"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  // Simulación de estado de login (luego se conectará a Supabase)
  const isLoggedIn = false;

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-green-50 flex flex-col items-center justify-start font-sans">
      {/* Logo y Tagline */}
      <header className="w-full flex flex-col items-center mt-10 mb-6">
        <div className="bg-green-200 rounded-full p-4 shadow-lg mb-2">
          {/* Placeholder logo */}
          <span className="text-4xl">🌱</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-1">Semillita</h1>
        <p className="text-lg text-green-700 font-medium">Donde tus árboles crecen contigo</p>
      </header>

      {/* Hero ilustrado */}
      <section className="w-full flex flex-col items-center mb-8 px-4">
        <div className="w-full max-w-md flex flex-col items-center">
          <div className="bg-white rounded-3xl shadow-md p-6 flex flex-col items-center">
            {/* Ilustración placeholder */}
            <span className="text-7xl mb-4">🧑‍🌾🌳</span>
            <h2 className="text-2xl font-semibold text-green-800 mb-2 text-center">¡Aprende a plantar y cuidar árboles jugando!</h2>
            <p className="text-center text-green-600 mb-4">Explora, cuida y mira crecer tu propio jardín virtual.</p>
            <Link href={isLoggedIn ? "/dashboard" : "/signup"}>
              <button className="bg-green-500 hover:bg-green-600 text-white text-lg font-bold py-3 px-8 rounded-full shadow transition-all">
                Empezar
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ¿Cómo funciona Semillita? */}
      <section className="w-full max-w-2xl bg-white rounded-3xl shadow-md p-6 mb-10 flex flex-col items-center">
        <h3 className="text-xl font-bold text-green-700 mb-4">¿Cómo funciona Semillita?</h3>
        <div className="flex flex-col md:flex-row gap-6 w-full justify-center items-center">
          {/* Paso 1 */}
          <div className="flex flex-col items-center">
            <span className="text-5xl mb-2">🌱</span>
            <span className="font-semibold text-green-800">Planta</span>
            <span className="text-green-600 text-sm text-center">Elige tu árbol favorito y plántalo</span>
          </div>
          {/* Paso 2 */}
          <div className="flex flex-col items-center">
            <span className="text-5xl mb-2">💧</span>
            <span className="font-semibold text-green-800">Cuida</span>
            <span className="text-green-600 text-sm text-center">Riega y cuida tu árbol cada día</span>
          </div>
          {/* Paso 3 */}
          <div className="flex flex-col items-center">
            <span className="text-5xl mb-2">🌳</span>
            <span className="font-semibold text-green-800">Mira crecer</span>
            <span className="text-green-600 text-sm text-center">Observa cómo evoluciona tu jardín</span>
          </div>
        </div>
      </section>
    </main>
  );
}
