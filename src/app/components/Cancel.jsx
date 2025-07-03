export default function CancelPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-red-100 text-red-800 px-4">
      <h1 className="text-3xl font-bold mb-4">Pago cancelado ❌</h1>
      <p className="text-lg mb-6">Tu pago no fue procesado. Puedes intentarlo de nuevo.</p>
      <a
        href="/cart"
        className="px-6 py-3 bg-red-700 text-white rounded hover:bg-red-800 transition"
      >
        Volver al carrito
      </a>
    </div>
  );
}
