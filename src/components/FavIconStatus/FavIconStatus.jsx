import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import hasItemInArray from "../../utils/hasItemInArray";
import { toast } from "react-hot-toast";
import { UserContext } from "../../context/AuthContext";
import { useContext, useState } from "react";
import { deleteField, doc, setDoc, updateDoc } from "firebase/firestore";
import db from "../../firebase";

const FavIconStatus = ({ favData, product }) => {
  const { user } = useContext(UserContext);
  const [no, setNo] = useState(0);
  const handelDelete = async (name, srno) => {
    const docRef = doc(db, "users", user?.uid);
    await updateDoc(docRef, {
      [`favourite.${srno}`]: deleteField(),
    });
    toast.success(`${name} removed from favourite`);
  };

  const handelFavourite = async (
    srno,
    productName,
    productPrice,
    productDescription
  ) => {
    const docRef = doc(db, "users", user?.uid);
    setDoc(
      docRef,
      {
        favourite: {
          [srno]: {
            srno: srno,
            product: productName,
            price: productPrice,
            description: productDescription,
          },
        },
      },
      { merge: true }
    );
    setNo(no + 1);
    toast(`${productName} added to favourite`, {
      icon: "🤤",
    });
  };

  const styles = {
    containerStyle:
      "absolute h-10 w-10 top-2 right-2 tooltip tooltip-left rounded-lg z-10",
    innerContainerStyle:
      "group/heart relative h-10 w-10 flex justify-center items-center",
    animatedHeartStyle:
      "absolute top-auto left-auto hidden text-red-600  group-hover/heart:block  h-8 w-8 group-hover/heart:animate-ping",
    heartStyle:
      "absolute top-0 left-0 text-red-600 md:hidden  group-hover:block  h-10 w-10",
  };

  return (
    <>
      {hasItemInArray(favData, product.name) ? (
        <div className={styles.containerStyle} data-tip="Remove From Favourite">
          <div className={styles.innerContainerStyle}>
            <AiFillHeart className={styles.animatedHeartStyle} />
            <AiFillHeart
              value={product.srno}
              onClick={() => handelDelete(product.name, product.srno)}
              className={styles.heartStyle}
            />
          </div>
        </div>
      ) : (
        <div className={styles.containerStyle} data-tip="Add To Favourite">
          <div className={styles.innerContainerStyle}>
            <AiOutlineHeart className={styles.animatedHeartStyle} />
            <AiOutlineHeart
              className={styles.heartStyle}
              onClick={() =>
                handelFavourite(
                  product.srno,
                  product.name,
                  product.price,
                  product.description
                )
              }
            />
          </div>
        </div>
      )}
    </>
  );
};

export default FavIconStatus;
