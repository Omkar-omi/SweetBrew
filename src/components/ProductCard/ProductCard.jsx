import { Carousel } from "react-responsive-carousel";
import FavIconStatus from "../FavIconStatus/FavIconStatus";
import {
  doc,
  increment,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/AuthContext";
import db from "../../firebase";
import { truncateString } from "../../utils/truncateString";
import coffee from "../../images/Coffee.jpg";
import ProductInfoModal from "../modals/ProductInfoModal";

const ProductCard = ({ product }) => {
  const { user } = useContext(UserContext);
  const [favData, setFavData] = useState();
  const [qty, setQty] = useState();
  const [no, setNo] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState();

  useEffect(() => {
    getFavData();
  }, [user]);

  const getFavData = async () => {
    const doc1 = doc(db, "users", user?.uid);
    onSnapshot(doc1, (snapshot) => {
      setFavData(Object.values(snapshot?.data().favourite));
    });
  };

  const handelAddToCart = async (productName, productPrice) => {
    if (qty > 0) {
      const docRef = doc(db, "users", user?.uid);
      setDoc(
        docRef,
        {
          cart: {
            [`${no}`]: {
              srno: no,
              quantity: Number(qty),
              product: productName,
              price: productPrice * qty,
              actual_price: productPrice,
            },
          },
        },
        { merge: true }
      );

      updateDoc(docRef, {
        cartvalue: increment(productPrice * qty),
      });

      setQty(0);
      setNo(no + 1);
      document.querySelectorAll("#input").forEach((input) => {
        input.value = "";
      });
    }
  };

  return (
    <>
      <div className="relative card w-full md:w-[320px] bg-neutral shadow-xl mb-5 mx-2 group overflow-hidden">
        <FavIconStatus favData={favData} product={product} />
        <Carousel
          showThumbs={false}
          autoPlay={!openModal}
          showArrows={false}
          showIndicators={false}
          showStatus={false}
          infiniteLoop
          interval={10000}
          stopOnHover
          emulateTouch
        >
          <img
            src={coffee}
            alt="coffee"
            className=" w-full md:w-[320px] aspect-video"
          />
          <img
            src={coffee}
            alt="coffee"
            className=" w-full md:w-[320px] aspect-video"
          />
          <img
            src={coffee}
            alt="coffee"
            className=" w-full md:w-[320px] aspect-video"
          />
        </Carousel>
        <div className="card-body flex flex-col justify-between items-center">
          <div>
            <h2 className="card-title text-white h-10 ">{product.name}</h2>
            <div className="flex flex-col gap-2 ">
              Description: {truncateString(product.description, 75)}{" "}
              <div
                className="text-blue-400 underline text-[12px] cursor-pointer"
                onClick={() => {
                  setOpenModal(true);
                  setSelectedProduct(product);
                }}
              >
                Know more.
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-2">
            <div className="card-actions flex">
              <div className="text-green-600 text-lg">
                Price: ₹ {product.price}
              </div>
              <input
                type="number"
                min={0}
                max={100}
                id="input"
                placeholder="Enter Quantity"
                className="grow rounded-lg pl-3 py-1 icon"
                required
                onChange={(e) => {
                  setQty(e.target.value);
                }}
                autoComplete="off"
              />
            </div>
            <button
              className="btn btn-primary w-full"
              onClick={() => handelAddToCart(product.name, product.price)}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
      <ProductInfoModal
        no={no}
        openModal={openModal}
        setOpenModal={setOpenModal}
        selectedProduct={selectedProduct}
      />
    </>
  );
};

export default ProductCard;
