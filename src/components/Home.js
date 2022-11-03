import CurrentOrder from "./Currentorder";
import NavBar from "./NavBar"
import ProductFilter from "./ProductFilter";
import ProductList from "./ProductList";

const Home = () => {
  return (
    <div>
      <NavBar />
      <div className="flex flex-row ">
        <div className="grow">
          <ProductFilter />
          <ProductList />
        </div>
        <CurrentOrder />
      </div>
    </div>
  );
}

export default Home;