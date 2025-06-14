import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import TestApplication from "./components/TestApplication";

export default function TestPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Hero/>
        {/* <TestApplication /> */}
      </main>
      <Footer />
    </>
  );
}
