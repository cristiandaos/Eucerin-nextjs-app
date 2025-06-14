import React from 'react'

export default function Hero() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center z-0"
        style={{
          backgroundImage: 'url(/img/banner.gif)',
        }}
      ></div>
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />
      <div className="relative z-20 flex flex-col items-start justify-center w-full h-full px-8 py-16 md:px-16 lg:px-32">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
          Luce hasta
          <span className="text-primary text-red-900"> 5 años </span> <br />
          más joven con nosotros
        </h1>
        <p className="text-lg text-white md:text-xl mt-4 mb-8">
          Descubre los mejores productos de Skincare con nosotros y rejuvenece nuevamente.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-start">
        </div>
      </div>
    </section>
  );
}
