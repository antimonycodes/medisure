import Navbar from "@/components/Navbar";
import Hero from "@/components/Home/Hero";
import HomeHighlights from "@/components/Home/HomeHighlights";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <HomeHighlights />
      <Footer />
    </div>
  );
}
