// src/app/success/page.jsx
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import SuccessContent from "@/app/components/Success";

export default function SuccessPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <SuccessContent />
      </main>
      <Footer />
    </>
  );
}
