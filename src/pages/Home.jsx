import Hero from "../components/Hero";
import ShopSection from "../components/ShopSection";

const Home = () => {
  return (
    <main className="flex flex-col items-center overflow-x-hidden w-full">
      <Hero />
      <ShopSection />
    </main>
  );
};

export default Home;
