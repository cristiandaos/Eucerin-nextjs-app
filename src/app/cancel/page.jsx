import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import CancelContent from "@/app/components/Cancel";

export default function CancelPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <CancelContent />
      </main>
      <Footer />
    </>
  );
}
