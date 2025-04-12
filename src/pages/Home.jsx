import Hero from "../components/Hero";
import ShopSection from "../components/ShopSection";

const Home = () => {
  return (
    <main className="flex flex-col items-center">
      <Hero />
      <ShopSection />
    </main>
  );
};

export default Home;
