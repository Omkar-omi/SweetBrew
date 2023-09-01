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
import hasItemInArray from "../../utils/hasItemInArray";
import hasProductInCart from "../../utils/hasProductInCart";

const ProductCard = ({ product }) => {
  const { user } = useContext(UserContext);
  const [favData, setFavData] = useState();
  const [qty, setQty] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState();
  const [cart, setCart] = useState();

  useEffect(() => {
    getFavData();
  }, [user]);

  const getFavData = async () => {
    const userDocRef = doc(db, "users", user?.uid);
    onSnapshot(userDocRef, (snapshot) => {
      setFavData(snapshot && Object.values(snapshot?.data().favourite));
    });
    onSnapshot(userDocRef, (snapshot) => {
      setCart(snapshot && Object.values(snapshot?.data().cart));
    });
  };

  const handelAddToCart = (productName, productPrice, srno) => {
    const docRef = doc(db, "users", user?.uid);
    document.querySelectorAll("#input").forEach((input) => {
      input.value = "";
    });
    if (qty > 0) {
      if (hasItemInArray(cart, productName)) {
        const productInCart = hasProductInCart(cart, productName);
        const newQty = Number(qty) + Number(productInCart.product.quantity);
        const newCartValue = productInCart.cartvalue + productPrice * qty;
        setDoc(
          docRef,
          {
            cart: {
              [`${srno}`]: {
                srno: srno,
                quantity: Number(newQty),
                product: productName,
                price: productPrice * newQty,
                actual_price: productPrice,
              },
            },
          },
          { merge: true }
        );
        updateDoc(docRef, {
          cartvalue: newCartValue,
        });
        setQty(0);
        return;
      } else {
        setDoc(
          docRef,
          {
            cart: {
              [`${srno}`]: {
                srno: srno,
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
      }
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
              onClick={() =>
                handelAddToCart(product.name, product.price, product.srno)
              }
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
      <ProductInfoModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        selectedProduct={selectedProduct}
      />
    </>
  );
};

export default ProductCard;
