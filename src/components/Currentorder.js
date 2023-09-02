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
import { useEffect, useState, useContext } from "react";
import coffee from "../images/Coffee.jpg";
import db from "../firebase";
import { useNavigate } from "react-router-dom";
import empty from "../images/empty.png";
import { UserContext } from "../context/AuthContext";
import { MdDeleteOutline } from "react-icons/md";

const CurrentOrder = () => {
  const { user } = useContext(UserContext);

  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (user) getData();
  }, [user]);

  const [data, setData] = useState();
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

  if ((data && Object.values(data[0]?.cart).length === 0) || !user) {
    return (
      <div className="relative sm:block hidden bg-neutral p-10 min-w-[384px] mt-10">
        <div className="sticky top-20">
          <div className="text-2xl text-gray-400 font-semibold mb-7">
            Current Order
          </div>
          <div className="flex flex-col ">
            <div className="h-[350px] border-solid border-b-2 border-primary scrollbar">
              {/* outer div */}
              <div className="flex flex-col justify-center items-center h-full">
                <img
                  src={empty}
                  className="h-20 w-20 rounded-xl "
                  alt="empty cart"
                />
                <div className="font-[600]">Empty cart</div>
                <div className="font-[600]">Add Items to your cart</div>
              </div>
            </div>
            <div className="mt-5">
              <div className="flex flex-row justify-between border-solid border-b-2 border-primary pb-5">
                <div className="">
                  <div>Subtotal:</div>
                  <div>CGST 9%:</div>
                  <div>SGST 9%:</div>
                </div>
                <hr />
                <div className="">
                  <div>₹ 0</div>
                  <div>₹ 0</div>
                  <div>₹ 0</div>
                </div>
              </div>
              <div className="flex flex-row justify-between my-5">
                <div className="font-medium text-xl">Total:</div>
                <div>₹ 0</div>
              </div>
              <div className="flex">
                <button
                  className="p-4 rounded-md border grow border-primary/20 bg-black/50 cursor-not-allowed"
                  disabled
                >
                  Check Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="relative sm:block hidden bg-neutral p-10 min-w-[384px] mt-10 ">
        <div className="sticky top-20">
          <div className="text-2xl text-gray-400 font-semibold mb-7">
            Current Order
          </div>
          <div className="flex flex-col ">
            <div className="overflow-y-auto scroll-m-4 snap-start h-[350px] border-solid border-b-2 border-primary scrollbar">
              {/* outer div */}
              {data
                ? data.length > 0
                  ? Object.values(data[0].cart).map((product) => (
                      <div className="flex flex-row mb-5" key={product.srno}>
                        <img
                          src={coffee}
                          className="h-20 w-20 rounded-xl"
                          alt="coffee"
                        />
                        <div className="mx-4 flex flex-col grow">
                          <div className="flex items-baseline justify-between">
                            <div className="font-medium text-white">
                              {product.product}
                            </div>

                            <MdDeleteOutline
                              className="hover:text-red-500 hover:scale-110"
                              onClick={() =>
                                handelDelete(product.price, product.srno)
                              }
                            />
                          </div>
                          <div className="flex flex-row  mt-5 items-center justify-between">
                            <div className="flex items-center">
                              <div
                                className="font-[700] text-[20px] border rounded-[8px] border-primary cursor-pointer hover:text-primary"
                                onClick={async () => {
                                  const docRef = doc(db, "users", user?.uid);

                                  await updateDoc(docRef, {
                                    [`cart.${product.srno}.quantity`]:
                                      Number(product.quantity) + 1,
                                    [`cart.${product.srno}.price`]:
                                      product.price + product.actual_price,
                                    cartvalue: increment(product.actual_price),
                                  });
                                }}
                              >
                                <div className="mx-3 mb-1">+</div>
                              </div>
                              <div className="text-warning mx-3">{`${product.quantity} x`}</div>
                              <div
                                className="font-[700] text-[20px] border rounded-[8px] border-primary cursor-pointer hover:text-primary"
                                onClick={async (e) => {
                                  const docRef = doc(db, "users", user?.uid);
                                  if (product.quantity <= 1) {
                                    await updateDoc(docRef, {
                                      [`cart.${product.srno}`]: deleteField(),
                                      cartvalue: increment(
                                        -product.actual_price
                                      ),
                                    });
                                  } else {
                                    await updateDoc(docRef, {
                                      [`cart.${product.srno}.quantity`]:
                                        Number(product.quantity) - 1,
                                      [`cart.${product.srno}.price`]:
                                        product.price - product.actual_price,

                                      cartvalue: increment(
                                        -product.actual_price
                                      ),
                                    });
                                  }
                                }}
                              >
                                <div className="mx-3 mb-1">-</div>
                              </div>
                            </div>
                            <div>{`₹ ${product.price}`}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  : null
                : null}
            </div>
            <div className="mt-5">
              <div className="flex flex-row justify-between border-solid border-b-2 border-primary pb-5">
                <div className="">
                  <div>Subtotal:</div>
                  <div>CGST 9%:</div>
                  <div>SGST 9%:</div>
                </div>
                <hr />
                <div>
                  {data
                    ? data.map((product) => (
                        <div key={0}>
                          <div>{`₹ ${product.cartvalue}.0`}</div>
                          <div>
                            ₹ {Number((product.cartvalue / 100) * 9).toFixed(2)}
                          </div>
                          <div>
                            ₹ {Number((product.cartvalue / 100) * 9).toFixed(2)}
                          </div>
                        </div>
                      ))
                    : null}
                </div>
              </div>
              <div className="flex flex-row justify-between my-5">
                <div className="font-medium text-xl">Total:</div>
                {data
                  ? data.map((product) => (
                      <div key={1}>
                        ₹{" "}
                        {Number(
                          product.cartvalue + (product.cartvalue / 100) * 18
                        ).toFixed(2)}
                      </div>
                    ))
                  : null}
              </div>
              <div className="flex">
                {isPending && (
                  <button className="content-center btn btn-primary grow loading">
                    Checking Out...
                  </button>
                )}
                {!isPending && (
                  <button
                    className="content-center btn btn-primary grow"
                    onClick={handelCheckout}
                  >
                    {" "}
                    Check Out
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default CurrentOrder;
