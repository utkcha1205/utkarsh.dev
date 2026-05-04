import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Leadership from "@/components/Leadership";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-background text-on-surface">
      <Navbar />
      <Hero />
      <div className="custom-divider" />
      <About />
      <div className="custom-divider" />
      <Skills />
      <div className="custom-divider" />
      <Experience />
      <div className="custom-divider" />
      <Projects />
      <div className="custom-divider" />
      <Leadership />
      <div className="custom-divider" />
      <Blog />
      <div className="custom-divider" />
      <Contact />
      <Footer />
    </main>
  );
}
