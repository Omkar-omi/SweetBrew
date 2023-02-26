import CurrentOrder from "./Currentorder";
import NavBar from "./NavBar";
import ProductFilter from "./ProductFilter";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { auth } from "../firebase";

const Home = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    if (user === null) navigate("/login");
  }, [user]);

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
