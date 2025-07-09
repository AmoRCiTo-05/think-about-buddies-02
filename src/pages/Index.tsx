
import Hero from "@/components/Hero";
import About from "@/components/About";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div id="home">
        <Hero />
      </div>
      <div id="about">
        <About />
      </div>
      <div id="features">
        <Features />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
