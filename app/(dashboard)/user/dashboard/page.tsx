import Balance from "./components/balance";
import Products from "./components/products";
import SpecialtiesCarousel from "./components/Specialites";
import ContinuousTimer from "./components/timer";
export const dynamic = "force-dynamic";
const Page = () => {
  return (
    <div className="container relative min-h-screen pb-20">
      {/* Main Content */}
      <div className="pr-4">
        <SpecialtiesCarousel />
        <ContinuousTimer />
        <Balance />
        <Products />
      </div>
    </div>
  );
};

export default Page;
