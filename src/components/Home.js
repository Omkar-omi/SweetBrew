import CurrentOrder from "./Currentorder";
import NavBar from "./NavBar"
import ProductFilter from "./ProductFilter";
import ProductList from "./ProductList";
import { UserAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = UserAuth();


  return (
    <div>
      <NavBar />
      <div className="flex flex-row ">
        <div className="grow">
          <ProductFilter />
          <ProductList />
        </div>
        <CurrentOrder name={user.displayName} />
      </div>
    </div>
  );
}

export default Home;