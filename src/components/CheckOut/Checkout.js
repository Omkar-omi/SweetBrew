import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaHome } from "react-icons/fa";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import coffee from "../../images/Coffee.jpg";
import db from "../../firebase";
import { BsInfoCircle, BsCreditCard2Back } from "react-icons/bs";
import { CgGoogle } from "react-icons/cg";
import { UserContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import ChangeAddressModal from "../modals/ChangeAddressModal";

const Checkout = () => {
  const [data, setData] = useState();
  const [address, setAddress] = useState("");
  const [paymentmethod, setPaymentMethod] = useState("");
  const [deliverymethod, setDeliveryMethod] = useState(false);
  const [discount, setDiscount] = useState(false);
  const [extracharges, setExtraCharges] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [delivery, setDelivery] = useState("");
  const [cart, setCart] = useState();
  const [cartvalue, setCartvalue] = useState();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (user) getData();
  }, [user]);

  useEffect(() => {
    if (user === null) navigate("/");
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

    const querySnapshotaddress = await getDocs(docRef);
    querySnapshotaddress.forEach((doc) => {
      setAddress(doc.data().address);
      setCart(doc.data().cart);
      setCartvalue(doc.data().cartvalue);
    });
  };
  const handelCheckout = async () => {
    setIsPending(true);
    if (deliverymethod && paymentmethod && address) {
      const docRef = await addDoc(collection(db, "orders"), {
        name: user?.displayName,
        address: address,
        cart: cart,
        email: user?.email,
        paymentmethod: paymentmethod,
        deliverymethod: delivery,
        time: serverTimestamp(),
      });
      if (extracharges === true) {
        updateDoc(doc(db, "orders", docRef.id), {
          cartvalue: Number(cartvalue + (cartvalue / 100) * 18 + 40).toFixed(2),
        });
      } else {
        updateDoc(doc(db, "orders", docRef.id), {
          cartvalue: Number(cartvalue + (cartvalue / 100) * 18 - 10).toFixed(2),
        });
      }
      await updateDoc(doc(db, "users", user?.uid), {
        cart: {},
        cartvalue: 0,
      });
      const timestamp = new Date();
      const time = timestamp.toLocaleTimeString();
      const date = timestamp.toLocaleDateString();

      setDoc(
        doc(db, "users", user?.uid),
        {
          yourorders: {
            [docRef.id]: {
              cart: cart,
              timestamp: `${date} at ${time} `,
              orderid: docRef.id,
              shippingCharges: delivery === "Fast" ? "+ ₹ 40" : "- ₹ 10",
              cartValue: cartvalue,
              total:
                delivery === "Fast"
                  ? Number(cartvalue + (cartvalue / 100) * 18 + 40).toFixed(2)
                  : Number(cartvalue + (cartvalue / 100) * 18 - 10).toFixed(2),
              taxes: Number((cartvalue / 100) * 18).toFixed(2),
              rating: 0,
              review: "",
            },
          },
        },
        { merge: true }
      );
      toast.success("Your order has been placed");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      if (!deliverymethod) toast.error("Select a valid dilivery method");
      if (!paymentmethod) toast.error("Select a valid payment method");
      if (!address) toast.error("Enter a delivery address");
      setIsPending(false);
    }
  };
  if (!user) {
    return;
  }
  return (
    <>
      <nav className="m-5 flex gap-5 justify-between border-b-2 border-primary pb-3 ">
        <div className="flex gap-5 md:gap-10 items-center">
          <Link to={"/"} className="content-center">
            <FaArrowLeft className="w-5 h-5" />
          </Link>
          <div className="text-primary text-2xl md:text-3xl">
            Order Overview
          </div>
        </div>
        <div className="hidden md:block mr-5">
          <ul className="steps gap-4">
            {!deliverymethod && <li className="step ">Delivery Method</li>}
            {deliverymethod && (
              <li className="step step-primary" data-content="✓">
                Delivery Method
              </li>
            )}
            {!address && <li className="step ">Delivery Address</li>}
            {address && (
              <li className="step step-primary" data-content="✓">
                Delivery address
              </li>
            )}
            {!paymentmethod && <li className="step ">Payment Method</li>}
            {paymentmethod && (
              <li className="step step-primary" data-content="✓">
                Payment Method
              </li>
            )}
          </ul>
        </div>
      </nav>
      <div className="flex md:flex-row flex-col justify-center mb-4">
        <div className="pl-5 pr-5 lg:pl-40 pt-5 lg:pr-10 md:border-solid md:border-r-2 border-primary">
          <div>
            <div className="text-white font-bold text-2xl">Order Summary</div>
            <div className="text-gray-200 w-80 font-medium my-2">
              Check your items and select your shipping according to your
              choice.
            </div>
          </div>
          <div>
            <div className="overflow-y-scroll h-80 border-solid border-b-2 border-primary scrollbar p-2">
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
                            <div className="text-sm md:text-lg text-white">
                              {product.product}
                            </div>
                          </div>
                          <div className="flex flex-row  mt-2 justify-between">
                            <div className="text-sm md:text-lg text-warning">{`${product.quantity} X`}</div>
                            <div className="text-sm md:text-lg">{`₹ ${product.price}`}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  : null
                : null}
            </div>
          </div>
          <div className="flex flex-col text-gray-200">
            <div className="font-medium mt-4">Available Shipping Methods </div>
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <div
                className={`border rounded-[4px] cursor-pointer border-white hover:border-[#dc944c] w-72 p-3 ${
                  delivery === "Fast" ? "border-[#dc944c]" : "border-white"
                }`}
                onClick={(e) => {
                  setExtraCharges(true);
                  setDiscount(false);
                  setDeliveryMethod(true);
                  setDelivery("Fast");
                }}
              >
                <div className="flex">
                  <div className="felx flex-col">
                    <div>Fast/Expidited Delivery</div>
                    <div className="text-sm">In a hurry? Select this.</div>
                  </div>
                  <div className="ml-5">+ ₹40</div>
                </div>
              </div>

              <div
                className={`border rounded-[4px] cursor-pointer border-white hover:border-[#dc944c] w-72 p-3 ${
                  delivery === "Normal" ? "border-[#dc944c]" : "border-white"
                }`}
                onClick={(e) => {
                  setDiscount(true);
                  setExtraCharges(false);
                  setDeliveryMethod(true);
                  setDelivery("Normal");
                }}
              >
                <div className="flex">
                  <div className="felx flex-col">
                    <div>Normal speed Delivery</div>
                    <div className="text-sm ">Not in a hurry?</div>
                  </div>
                  <div className="ml-5">- ₹10</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pl-5 pr-5 lg:pr-40 pt-5 lg:pl-10 ">
          <div>
            <div className="font-bold text-white text-3xl">Payment Details</div>
            <div className="font-medium my-2 text-gray-200 w-80">
              Complete your purchase by profiding your payment details below.
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-200 mb-2">
              Email Address:
            </label>
            <input
              type="text"
              className="p-2 rounded-lg border-solid border-4 border-green-400 text-black  bg-white/90"
              id="email"
              value={user?.email}
              readOnly={true}
            />
          </div>
          <div className="flex flex-col">
            <div className="text-gray-200 my-2">Delivery Address</div>
            <textarea
              type="text"
              className={`p-2 resize-none rounded-lg text-black bg-white/90 h-[100px] ${
                address && "border-4 border-green-400"
              }`}
              value={
                address &&
                `${address && address?.flatno?.trim()}, ${
                  address && address?.area?.trim()
                }, ${address && address?.landmark?.trim()} `
              }
              readOnly
            />
            <label
              className="btn btn-primary  mt-4"
              htmlFor="addAddress-modal"
              onClick={() => setOpenModal(true)}
            >
              {!address ? (
                <>
                  Add Address&nbsp;
                  <FaHome />
                </>
              ) : (
                <>
                  Update Address&nbsp;
                  <FaHome />
                </>
              )}
            </label>
          </div>
          <div className="flex flex-row justify-between border-solid border-b-2 border-primary pb-5 mt-4 text-gray-200">
            <div>
              <div className="tooltip" data-tip="Subtotal Excluding Tax">
                <div>
                  Subtotal:
                  <BsInfoCircle className="inline ml-2" />
                </div>
              </div>
              <div>CGST 9%:</div>
              <div>SGST 9%:</div>
              {discount && <div> Discount:</div>}
              {extracharges && <div>{`Extra charges: (Fast Delivery)`}</div>}
              <div>Total:</div>
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
                      {discount && <div> - ₹10</div>}
                      {extracharges && <div>₹40</div>}
                      {discount && (
                        <div>
                          ₹{" "}
                          {Number(
                            product.cartvalue +
                              (product.cartvalue / 100) * 18 -
                              10
                          ).toFixed(2)}
                        </div>
                      )}
                      {extracharges && (
                        <div>
                          ₹{" "}
                          {Number(
                            product.cartvalue +
                              (product.cartvalue / 100) * 18 +
                              40
                          ).toFixed(2)}
                        </div>
                      )}
                    </div>
                  ))
                : null}
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex gap-2 ">
              <div
                className={`w-1/2 cursor-pointer rounded-[4px] border hover:border-primary p-2 md:p-2 text-base md:text-[16px] text-gray-300 ${
                  paymentmethod === "Gpay"
                    ? "border-primary"
                    : "border-transparent"
                }`}
                onClick={(e) => setPaymentMethod("Gpay")}
              >
                <label htmlFor="radio-gpay" className="flex items-center">
                  <CgGoogle className="inline-flex text-3xl" />
                  Pay / UPI
                </label>
              </div>
              <div
                className={`w-1/2 cursor-pointer rounded-[4px] border hover:border-primary p-2 md:p-2 text-base md:text-[16px] text-gray-300 ${
                  paymentmethod === "Debit Card"
                    ? "border-primary"
                    : "border-transparent"
                }`}
                onClick={(e) => setPaymentMethod("Debit Card")}
              >
                <label htmlFor="radio-db" className="flex items-center">
                  <BsCreditCard2Back className="mr-2 inline-flex text-3xl" />
                  Debit Card
                </label>
              </div>
            </div>
            <div className="flex gap-2 ">
              <div
                className={`w-1/2 cursor-pointer rounded-[4px] border hover:border-primary p-2 md:p-2 text-base md:text-[16px] text-gray-300 ${
                  paymentmethod === "Credit Card"
                    ? "border-primary"
                    : "border-transparent"
                }`}
                onClick={(e) => setPaymentMethod("Credit Card")}
              >
                <label htmlFor="radio-cd" className="flex items-center">
                  <BsCreditCard2Back className="mr-2 inline-flex text-3xl" />
                  Credit Card
                </label>
              </div>
              <div
                className={`w-1/2 cursor-pointer rounded-[4px] border hover:border-primary p-2 md:p-2 text-base md:text-[16px] text-gray-300 ${
                  paymentmethod === "Cash On Delivery"
                    ? "border-primary"
                    : "border-transparent"
                }`}
                onClick={(e) => setPaymentMethod("Cash On Delivery")}
              >
                <label htmlFor="radio-cod">Cash On Delivery</label>
              </div>
            </div>
          </div>
          <div className="flex mt-2">
            {isPending && (
              <button className="content-center btn btn-primary grow loading">
                Checking Out...
              </button>
            )}
            {!isPending && (
              <button
                disabled={data && Object.values(data[0].cart).length <= 0}
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
      {address && (
        <ChangeAddressModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          address={address}
          setAddress={setAddress}
        />
      )}
    </>
  );
};

export default Checkout;
