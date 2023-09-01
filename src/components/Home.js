import CurrentOrder from "./Currentorder";
import NavBar from "../commons/Navbar/NavBar";
import ProductFilter from "./ProductFilter";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user === null) navigate("/login");
  }, [user]);

  if (!user) {
    return;
  }
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
