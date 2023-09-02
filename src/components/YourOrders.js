import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import db from "../firebase";
import { BsInfoCircle } from "react-icons/bs";
import Star from "../commons/Star";
import { UserContext } from "../context/AuthContext";
import RatingModal from "./modals/RatingModal";

const YourOrders = () => {
  const { user } = useContext(UserContext);
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [review, setReview] = useState("");
  const [id, setId] = useState("");
  const [data, setData] = useState();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [yourorders, setYourOrders] = useState();
  const [selectedProduct, setSelectedProduct] = useState();

  useEffect(() => {
    if (user) getData();
  }, [user]);

  console.log(yourorders);
  const handelReview = async () => {
    updateDoc(doc(db, "orders", id), {
      rating: rating,
      review: review,
    });

    setDoc(
      doc(db, "users", user?.uid),
      {
        yourorders: {
          [`${id}`]: {
            rating: rating,
            review: review,
          },
        },
      },
      { merge: true }
    );
    setRating(null);
    setOpenModal(false);
    setReview("");
  };

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

    const userDocRef = doc(db, "users", user?.uid);
    onSnapshot(userDocRef, (snapshot) => {
      setYourOrders(snapshot && Object.values(snapshot?.data().yourorders));
    });
  };

  useEffect(() => {
    if (user === null) navigate("/login");
  }, [user]);

  if (!user) {
    return;
  }

  if (data && Object.values(data[0].yourorders).length === 0) {
    return (
      <>
        <nav className="m-5 flex items-center pb-3 border-b-2 border-solid border-primary ">
          <Link to={"/"}>
            <FaArrowLeft className=" w-5 h-5" />
          </Link>
          <div className="ml-5 text-xl text-white">Order History</div>
        </nav>
        <div className="flex flex-col items-center justify-center h-96 text-2xl text-primary text-center">
          You have&apos;t ordered anything yet!
        </div>
      </>
    );
  } else {
    return (
      <>
        <nav className="m-5 flex items-center  pb-3 border-b-2 border-solid border-primary ">
          <Link to={"/"}>
            <FaArrowLeft className=" w-5 h-5" />{" "}
          </Link>
          <div className="ml-5 text-xl text-white">Order History</div>
        </nav>
        <div className="flex flex-col">
          {data &&
            Object.values(data[0].yourorders).map((product, index) => (
              <div
                className="flex flex-col mb-5 mx-4 sm:mx-[100px] md:mx-[150px] lg:mx-[300px] border border-white/50 p-3 rounded-lg"
                key={index}
              >
                <div className="flex items-center justify-between gap-1 border-b border-dashed border-white/50 pb-2 mb-2">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-1">
                    <div className="text-[14px]">Bill no:</div>
                    <div className="flex text-primary/80 text-[14px]">
                      {product.orderid}
                    </div>
                  </div>
                  <div className="text-xs md:text-[14px]">
                    {product.timestamp}
                  </div>
                </div>
                {data &&
                  Object.values(product.cart).map((item, i) => (
                    <div
                      className="border-b border-white/30 mx-3 pb-2 mb-2 flex flex-col grow"
                      key={i}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 font-medium text-white  md:text-xl">
                          {item.product}
                          <div className="text-warning md:text-xl">{`${item.quantity} x`}</div>
                        </div>
                        <div className="flex flex-row my-2 justify-between items-center">
                          <div className="text-sm md:text-[14px]">{`₹ ${item.price}`}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                <div className="flex flex-col w-full px-3">
                  <div className="flex flex-row justify-between items-center">
                    <div className="text-xs md:text-[14px]">Items total:</div>
                    <div className="text-sm md:text-[14px]">{`₹ ${product.cartValue}`}</div>
                  </div>
                  <div className="flex gap-1 justify-between items-center">
                    <div className="text-xs md:text-[14px] ">
                      Delivery charge: (
                      {product.shippingCharges === "+ ₹ 40" ? "Fast" : "Normal"}
                      )
                    </div>
                    <div className="text-sm md:text-[14px]">
                      {product.shippingCharges}
                    </div>
                  </div>
                  <div className="flex gap-1 justify-between items-center">
                    <div
                      className="text-xs md:text-[14px] tooltip before:max-w-[150px]"
                      data-tip={`CGST(9%): ₹ ${product.taxes / 2} SGST(9%): ₹ ${
                        product.taxes / 2
                      }`}
                    >
                      GST (18%):
                      <BsInfoCircle className="inline ml-2" />
                    </div>
                    <div className="text-sm md:text-[14px]">{`+ ₹ ${product.taxes}`}</div>
                  </div>
                  <div className="flex gap-1 justify-between items-center border-t border-white/10 border-dashed pt-2 mt-2">
                    <div className="text-xs md:text-[14px]">Total:</div>
                    <div className="text-sm md:text-[14px]">{`₹ ${product.total}`}</div>
                  </div>
                </div>

                <div
                  value={index}
                  onMouseEnter={() => setId(product.orderid)}
                  onTouchStart={() => setId(product.orderid)}
                  className="flex flex-row items-center justify-between p-3  "
                >
                  <div className="text-white text-sm md:text-lg">
                    Review: {product?.review}
                  </div>
                  <div
                    onClick={() => {
                      if (product.review === "" || product.rating === 0) {
                        setSelectedProduct(product);
                        setOpenModal(true);
                      }
                    }}
                    className="flex flex-row cursor-pointer"
                  >
                    <Star stars={product.rating} />
                  </div>
                </div>
              </div>
            ))}
        </div>
        <RatingModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          review={review}
          setReview={setReview}
          setRating={setRating}
          handelReview={handelReview}
          rating={rating}
          selectedProduct={selectedProduct}
        />
      </>
    );
  }
};

export default YourOrders;
