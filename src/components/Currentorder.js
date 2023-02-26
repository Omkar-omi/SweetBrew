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
import { useEffect, useState } from "react";
import coffee from "../images/Coffee.jpg";
import db from "../firebase";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import empty from "../images/empty.png";

const CurrentOrder = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();
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
  const handelCheckout = () => {
    setIsPending(true);
    setTimeout(() => {
      navigate("/checkout");
      setIsPending(false);
    }, 500);
  };

  if (data && Object.values(data[0]?.cart).length === 0) {
    return (
      <div className="sm:block hidden bg-neutral p-10 min-w-[384px] mt-10">
        <div className="text-2xl text-gray-400 font-semibold mb-7">
          Current Order
        </div>
        <div className="flex flex-col ">
          <div className="h-96 border-solid border-b-2 border-primary scrollbar">
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
          <div className="mt-11">
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
              <button className="btn btn-primary grow" disabled>
                Check Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="sm:block hidden bg-neutral p-10 min-w-[384px] mt-10 ">
        <div className="text-2xl text-gray-400 font-semibold mb-7">
          Current Order
        </div>
        <div className="flex flex-col ">
          <div className="overflow-y-scroll scroll-m-4 snap-start h-96 border-solid border-b-2 border-primary scrollbar">
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
                          <button
                            onClick={handelDelete}
                            value={product.srno}
                            data-price={product.price}
                          >
                            x
                          </button>
                        </div>
                        <div className="flex flex-row  mt-5">
                          <div className="text-warning mr-14">{`${product.quantity} x`}</div>
                          <div>{`₹ ${product.price}`}</div>
                        </div>
                      </div>
                    </div>
                  ))
                : null
              : null}
          </div>
          <div className="mt-11">
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
    );
  }
};

export default CurrentOrder;
