import { SiCoffeescript } from "react-icons/si";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { BsPersonCircle, BsFillCartFill } from "react-icons/bs";

const NavBar = () => {

  const { user, logout } = UserAuth();
  const navigate = useNavigate();
  const handelLogout = async () => {
    try {
      await logout()
      navigate("/login")
      alert(`${user.displayName} has logged out`)
    } catch (e) {
      console.log(e.message);
    }
  }
  return (
    <div className="navbar bg-base-100 gap-3 border-solid border-b-2 border-primary">
      <div className="flex-1">
        <Link to={"/"} className="btn btn-ghost normal-case text-xl text-center"><SiCoffeescript />&nbsp; Coffee House</Link>
      </div>
      <div className="flex-none ">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <div className="rounded-full ring ring-success ring-offset-base-100 ring-offset-8">
              <BsFillCartFill className="h-6 w-6" />
              {/* TO-DO */}
              {/* <span className="badge badge-sm indicator-item">8</span> */}
            </div>
          </label>
          <div tabIndex={0} className="mt-3 card card-compact dropdown-content w-52  bg-gray-800 text-white shadow">
            <div className="card-body">
              <span className="font-bold text-lg">8 Items</span>
              <span className="text-info">Subtotal: $999</span>
              <div className="card-actions">
                <button className="btn btn-primary btn-block">View cart</button>
              </div>
            </div>
          </div>
        </div>
        <div className="dropdown dropdown-end mx-3 ">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar online">
            <div className=" rounded-full ring ring-success ring-offset-base-100 ring-offset-8">
              <BsPersonCircle className="text-2xl " />
            </div>
          </label>
          <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-gray-800 text-white rounded-box w-52 ">
            <li>
              <a className="justify-between">
                Profile
              </a>
            </li>
            {/* TO-DO */}
            {/* <li><a>Favourite</a></li> */}
            <li><a>Settings</a></li>
            <li onClick={handelLogout}><a>Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NavBar;