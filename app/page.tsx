import LoadingScreen from "@/components/ui/LoadingScreen";
import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Timeline from "@/components/sections/Timeline";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <LoadingScreen />
      <Header />
      <main className="flex-1">
        <Hero />
        <Timeline />
      </main>
      <Footer />
    </>
  );
}
