import Header from "../components/Header";
import Footer from "../components/Footer";
import Cart from "../components/Cart";

export default function CartPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <Cart />
      </main>
      <Footer />
    </>
  );
}