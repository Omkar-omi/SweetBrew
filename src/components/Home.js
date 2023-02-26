import CurrentOrder from "./Currentorder";
import NavBar from "./NavBar"
import ProductFilter from "./ProductFilter";
import {  useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(()=>{
    if(!users) navigate("/login");
  },[])

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
}

export default Home;