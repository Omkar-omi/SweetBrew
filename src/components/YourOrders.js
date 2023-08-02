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
import { FaArrowLeft, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import db from "../firebase";

import { BsChevronRight } from "react-icons/bs";
import Star from "./Star";
import { UserContext } from "../context/AuthContext";

const YourOrders = () => {
  const { user } = useContext(UserContext);
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [review, setReview] = useState("");
  const [id, setId] = useState("");
  const [data, setData] = useState();

  useEffect(() => {
    getData();
  }, [user]);

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
  };

  return (
    <>
      <nav className="m-5 flex items-center  pb-3 border-b-2 border-solid border-primary ">
        <Link to={"/"}>
          <FaArrowLeft className=" w-5 h-5" />{" "}
        </Link>
        <div className="ml-5 text-xl  text-white">Order History</div>
      </nav>
      <div className="flex items-center flex-col">
        {data
          ? Object.values(data[0].yourorders).map((product, index) => (
              <div
                className="flex flex-col mb-5 w-72 md:w-[600px] border-solid border-2 p-3 rounded-lg"
                key={index}
              >
                {data
                  ? Object.values(product.cart).map((item, i) => (
                      <div className="mx-4 flex flex-col grow" key={i}>
                        <div className="flex items-center justify-between">
                          <div className="text-warning md:text-xl">{`${item.quantity} x`}</div>
                          <div className="font-medium text-white pb-2 md:text-xl my-2">
                            {" "}
                            {item.product}
                          </div>
                        </div>
                        <hr />
                        <div className="flex flex-row my-2 justify-between items-center">
                          <div className="text-xs md:text-lg">
                            {product.timestamp}
                          </div>
                          <div className="text-sm md:text-xl">{`₹ ${item.price}`}</div>
                        </div>
                        <hr />
                      </div>
                    ))
                  : null}
                {(product.review === "" || product.rating === null) && (
                  <div
                    className="flex items-center justify-end mt-2"
                    value={index}
                    onMouseEnter={() => setId(product.orderid)}
                    onTouchStart={() => setId(product.orderid)}
                  >
                    <label
                      htmlFor="rating-modal"
                      className="cursor-pointer md:text-lg"
                      value={product.orderid}
                    >
                      Rate{" "}
                    </label>
                    <div>
                      <BsChevronRight />
                    </div>
                  </div>
                )}
                <div className="flex flex-row items-center justify-between p-3  ">
                  <div className="ml-2 text-white text-sm md:text-lg">
                    Review: {product.review}
                  </div>
                  <div className="flex flex-row mr-2">
                    <Star stars={product.rating} />
                  </div>
                </div>
              </div>
            ))
          : null}
      </div>
      {/* modal for rating   */}
      <input type="checkbox" id="rating-modal" className="modal-toggle" />
      <div className="modal modal-middle">
        <div className="modal-box">
          <label
            htmlFor="rating-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="font-bold text-lg">Rate your order:</h3>
          <div className="flex flex-col ">
            <div className="my-3">Write a Review:</div>
            <textarea
              placeholder="(Optional)"
              className="p-2 rounded-lg text-black w-64 sm:w-[450px] h-24 "
              type="email"
              onChange={(e) => setReview(e.target.value)}
            />
          </div>
          <div className="flex justify-between items-center my-3">
            <label
              htmlFor="rating-modal"
              className="btn my-3 btn-primary"
              onClick={handelReview}
            >
              Save
            </label>
            <div className="flex">
              {[...Array(5)].map((star, i) => {
                const ratingValue = i + 1;
                return (
                  <label key={i}>
                    <input
                      type="radio"
                      name="rating"
                      className="ratingcustom"
                      value={ratingValue}
                      onClick={() => setRating(ratingValue)}
                    />
                    <FaStar
                      className="star"
                      size={50}
                      color={
                        ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"
                      }
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(null)}
                    />
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default YourOrders;
