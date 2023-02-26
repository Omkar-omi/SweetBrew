import { SiCoffeescript } from "react-icons/si";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { BsPersonCircle, BsFillCartFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  collection,
  deleteField,
  doc,
  increment,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import db from "../firebase";

const NavBar = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const [data, setData] = useState();
  const getData = async () => {
    const docRef = query(
      collection(db, "users"),
      where("name", "==", localStorage.getItem("name"))
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
  const handelDelete = async (e) => {
    const docRef = doc(db, "users", user.uid);
    const srno = e.target.value;
    const price = e.target.getAttribute("data-price");
    await updateDoc(docRef, {
      [`cart.${srno}`]: deleteField(),
      cartvalue: increment(-price),
    });
  };

  const { logout } = UserAuth();
  const navigate = useNavigate();
  const handelLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("name");
      localStorage.removeItem("id");
      navigate("/login");
      alert(`${user.displayName} has logged out`);
    } catch (e) {
      console.log(e.message);
    }
  };

  const handelCheckout = () => {
    setIsPending(true);
    setTimeout(() => {
      navigate("/checkout");
      setIsPending(false);
    }, 500);
  };
  return (
    <div className="navbar fixed z-10 bg-base-100 gap-3 border-solid border-b-2 border-primary">
      <div className="flex-1">
        <Link
          to={"/"}
          className="btn btn-ghost normal-case text-xl text-center"
        >
          <SiCoffeescript />
          &nbsp; Coffee House
        </Link>
      </div>
      <div>
        {/* TO-DO: fix the auto closing when you delete a item from cart(small screens) */}
        {data
          ? data.length > 0
            ? Object.values(data).map((product) => (
                <div className="dropdown dropdown-end  sm:hidden" key={0}>
                  <label tabIndex={0} className="btn btn-ghost btn-circle">
                    <div className="static">
                      <span className=" absolute text-black z-10 top-0 right-0 text-md bg-primary rounded-full w-5 h-5  p-1">
                        {Object.keys(product.cart).length}
                      </span>
                      <div className="rounded-full ring ring-success ring-offset-base-100 ring-offset-8">
                        <BsFillCartFill className=" h-6 w-6" />
                      </div>
                    </div>
                  </label>
                  <div
                    tabIndex={0}
                    className=" mt-3 card card-compact dropdown-content w-64  bg-gray-800 text-white shadow"
                  >
                    <div className="card-body">
                      <span className="font-bold text-lg">{`${
                        Object.keys(product.cart).length
                      } Items`}</span>
                      <span className="text-info">{`Subtotal: ₹ ${product.cartvalue}`}</span>
                      <hr />
                      {data
                        ? Object.values(data[0].cart).map((product) => (
                            <div className="flex flex-col" key={product.srno}>
                              <div className="flex items-baseline justify-between mb-2">
                                <div className="font-medium text-white text-lg">
                                  {product.product}
                                </div>
                                <button
                                  onClick={handelDelete}
                                  value={product.srno}
                                  data-price={product.price}
                                >
                                  X
                                </button>
                              </div>
                              <div className="flex flex-row   items-center justify-between">
                                <div className="flex items-center">
                                  <div
                                    className="font-[700] text-[20px] border rounded-[8px] border-primary cursor-pointer hover:text-primary"
                                    onClick={async () => {
                                      const docRef = doc(db, "users", user.uid);

                                      await updateDoc(docRef, {
                                        [`cart.${product.srno}.quantity`]:
                                          Number(product.quantity) + 1,
                                        [`cart.${product.srno}.price`]:
                                          product.price + product.actual_price,
                                        cartvalue: increment(
                                          product.actual_price
                                        ),
                                      });
                                    }}
                                  >
                                    <div className="mx-3 mt-2 mb-3">+</div>
                                  </div>
                                  <div className="text-warning mx-3">{`${product.quantity} x`}</div>
                                  <div
                                    className="font-[700] text-[20px] border rounded-[8px] border-primary cursor-pointer hover:text-primary"
                                    onClick={async (e) => {
                                      const docRef = doc(db, "users", user.uid);
                                      if (product.quantity <= 1) {
                                        await updateDoc(docRef, {
                                          [`cart.${product.srno}`]:
                                            deleteField(),
                                          cartvalue: increment(
                                            -product.actual_price
                                          ),
                                        });
                                      } else {
                                        await updateDoc(docRef, {
                                          [`cart.${product.srno}.quantity`]:
                                            Number(product.quantity) - 1,
                                          [`cart.${product.srno}.price`]:
                                            product.price -
                                            product.actual_price,

                                          cartvalue: increment(
                                            -product.actual_price
                                          ),
                                        });
                                      }
                                    }}
                                  >
                                    <div className="mx-3 mt-2 mb-3">-</div>
                                  </div>
                                </div>
                                <div>{`₹ ${product.price}`}</div>
                              </div>
                            </div>
                          ))
                        : null}
                      {!Object.keys(product.cart).length == 0 && <hr />}
                      <div className="card-actions">
                        {isPending && (
                          <button className="content-center btn btn-primary grow loading">
                            Checking Out...
                          </button>
                        )}
                        {!isPending &&
                          !Object.keys(product.cart).length == 0 && (
                            <button
                              className="btn btn-primary btn-block"
                              onClick={handelCheckout}
                            >
                              Check Out
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : null
          : null}
        <div className="dropdown dropdown-end mx-3 ">
          <label
            tabIndex={0}
            className="btn btn-ghost btn-circle avatar online"
          >
            <div className=" rounded-full ring ring-success ring-offset-base-100 ring-offset-8">
              <BsPersonCircle className="text-2xl " />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-gray-800 text-white rounded-box w-52 "
          >
            <div className="flex flex-col mb-2 px-2">
              <div>Name: {localStorage.getItem("name")}</div>
              <div>Email: {localStorage.getItem("email")}</div>
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
      </div>
    </div>
  );
};

export default NavBar;
