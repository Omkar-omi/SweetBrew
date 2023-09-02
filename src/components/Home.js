import CurrentOrder from "./Currentorder";
import NavBar from "../commons/Navbar/NavBar";
import ProductFilter from "./ProductFilter";

const Home = () => {
  return (
    <div>
      <NavBar />
      <div className="flex flex-row ">
        <div className="grow">
          <ProductFilter />
        </div>
        <CurrentOrder />
      </div>
    </div>
  );
};

export default Home;
