import { useContext } from "react";
import { BsPersonCircle } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/AuthContext";
import { toast } from "react-hot-toast";

const UserIcon = () => {
  const { logout, user } = useContext(UserContext);
  const navigate = useNavigate();

  const handelLogout = async () => {
    try {
      await logout();
      navigate("/login");
      toast.success(`${user?.displayName} has logged out`);
    } catch (e) {
      console.error(e.message);
    }
  };
  return (
    <div className="dropdown dropdown-end mx-3 ">
      <label tabIndex={0} className="btn btn-ghost btn-circle avatar online">
        <div className=" rounded-full ring ring-success ring-offset-base-100 ring-offset-8">
          <BsPersonCircle className="text-2xl " />
        </div>
      </label>
      <ul
        tabIndex={0}
        className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-gray-800 text-white rounded-box w-52 "
      >
        <div className="flex flex-col mb-2 px-2">
          <div>Name: {user?.displayName}</div>
          <div>Email: {user?.email}</div>
        </div>
        <hr />
        <li>
          <Link className="text-center mt-2" to={"/profile"}>
            Profile
          </Link>
        </li>
        <li>
          <Link className="text-center mt-2" to={"/favourite"}>
            Favourite
          </Link>
        </li>
        <li>
          <Link className="text-center mt-2" to={"/yourorders"}>
            Your Orders
          </Link>
        </li>
        <li onClick={handelLogout}>
          <a>Logout</a>
        </li>
      </ul>
    </div>
  );
};

export default UserIcon;
