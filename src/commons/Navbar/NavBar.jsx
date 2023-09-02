import logo from "../../images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import db from "../../firebase";
import UserIcon from "./sections/UserIcon";
import MobileCartIcon from "./sections/MobileCartIcon";

const NavBar = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [data, setData] = useState();

  useEffect(() => {
    if (user) getData();
  }, [user]);

  const getData = async () => {
    const docRef = query(
      collection(db, "users"),
      where("email", "==", user?.email)
    );
    onSnapshot(docRef, (snapshot) => {
      setData(
        snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
  };

  return (
    <div className="navbar fixed bg-base-100 gap-3 border-solid border-b-2 border-primary z-50">
      <div className="flex-1">
        <Link
          to={"/"}
          className="flex gap-2 items-center btn btn-ghost normal-case text-xl text-center"
        >
          <img src={logo} alt="coffee" className="w-[25px] h-[25px]" />
          <div>Sweet Brew</div>
        </Link>
      </div>
      {!user ? (
        <div onClick={() => navigate("/login")} className="btn btn-primary">
          Login
        </div>
      ) : (
        <div>
          {data &&
            data.length > 0 &&
            Object.values(data).map((product, index) => (
              <MobileCartIcon product={product} key={index} />
            ))}
          <UserIcon />
        </div>
      )}
    </div>
  );
};

export default NavBar;
