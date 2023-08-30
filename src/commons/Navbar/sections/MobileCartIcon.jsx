import { deleteField, doc, increment, updateDoc } from "firebase/firestore";
import { useContext, useState } from "react";
import { BsFillCartFill } from "react-icons/bs";
import { MdDeleteOutline } from "react-icons/md";
import db from "../../../firebase";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/AuthContext";

const MobileCartIcon = ({ product }) => {
  const { user } = useContext(UserContext);
  const [isPending, setIsPending] = useState(false);
  const [cartDropDownOpen, setCartDropDownOpen] = useState(false);

  const navigate = useNavigate();

  const handelDelete = async (price, srno) => {
    const docRef = doc(db, "users", user?.uid);
    await updateDoc(docRef, {
      [`cart.${srno}`]: deleteField(),
      cartvalue: increment(-price),
    });
  };

  const handelCheckout = () => {
    setIsPending(true);
    setTimeout(() => {
      navigate("/checkout");
      setIsPending(false);
    }, 500);
  };

  return (
    <div
      className={`dropdown dropdown-end  sm:hidden ${
        cartDropDownOpen && "dropdown-open"
      }`}
    >
      <label
        onClick={() => setCartDropDownOpen(!cartDropDownOpen)}
        className="btn btn-ghost btn-circle"
      >
        <div className="static">
          <span className=" absolute text-black z-10 top-0 right-0 text-md bg-primary rounded-full w-5 h-5  p-1">
            {product && Object.keys(product.cart).length}
          </span>
          <div className="rounded-full ring ring-success ring-offset-base-100 ring-offset-8">
            <BsFillCartFill className=" h-6 w-6" />
          </div>
        </div>
      </label>
      <div className=" mt-3 card card-compact dropdown-content w-64 min-[400px]:w-80  bg-gray-800 text-white shadow !-right-[25px]">
        <div className="card-body">
          <span className="font-bold text-lg">{`${
            product && Object.keys(product.cart).length
          } Items`}</span>
          <span className="text-info">{`Subtotal: ₹ ${product.cartvalue}`}</span>
          <hr />
          {product &&
            Object.values(product.cart).map((item) => (
              <div className="flex flex-col" key={item.srno}>
                <div className="flex items-baseline justify-between mb-2">
                  <div className="font-medium text-white text-lg">
                    {item.product}
                  </div>
                  <MdDeleteOutline
                    className="hover:text-red-500 hover:scale-110"
                    onClick={() => handelDelete(item.price, item.srno)}
                  />
                </div>
                <div className="flex flex-row   items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="font-[700] text-[20px] border rounded-[8px] border-primary cursor-pointer hover:text-primary"
                      onClick={async () => {
                        const docRef = doc(db, "users", user?.uid);

                        await updateDoc(docRef, {
                          [`cart.${item.srno}.quantity`]:
                            Number(item.quantity) + 1,
                          [`cart.${item.srno}.price`]:
                            item.price + item.actual_price,
                          cartvalue: increment(item.actual_price),
                        });
                      }}
                    >
                      <div className="mx-3 mt-2 mb-3">+</div>
                    </div>
                    <div className="text-warning mx-3">{`${item.quantity} x`}</div>
                    <div
                      className="font-[700] text-[20px] border rounded-[8px] border-primary cursor-pointer hover:text-primary"
                      onClick={async (e) => {
                        const docRef = doc(db, "users", user?.uid);
                        if (item.quantity <= 1) {
                          await updateDoc(docRef, {
                            [`cart.${item.srno}`]: deleteField(),
                            cartvalue: increment(-item.actual_price),
                          });
                        } else {
                          await updateDoc(docRef, {
                            [`cart.${item.srno}.quantity`]:
                              Number(item.quantity) - 1,
                            [`cart.${item.srno}.price`]:
                              item.price - item.actual_price,

                            cartvalue: increment(-item.actual_price),
                          });
                        }
                      }}
                    >
                      <div className="mx-3 mt-2 mb-3">-</div>
                    </div>
                  </div>
                  <div>{`₹ ${item.price}`}</div>
                </div>
              </div>
            ))}

          {product && !Object.keys(product.cart).length === 0 && <hr />}
          <div className="card-actions">
            {!isPending ? (
              product &&
              !Object.keys(product.cart).length === 0 && (
                <button
                  className="btn btn-primary btn-block"
                  onClick={handelCheckout}
                >
                  Check Out
                </button>
              )
            ) : (
              <button className="content-center btn btn-primary grow loading">
                Checking Out...
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileCartIcon;
