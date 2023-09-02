import {
  collection,
  deleteField,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import db from "../firebase";
import coffee from "../images/Coffee.jpg";
import { UserContext } from "../context/AuthContext";
import { MdDeleteOutline } from "react-icons/md";

const Favourite = () => {
  const { user } = useContext(UserContext);
  const [data, setData] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) getData();
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
  };

  const handelDelete = async (srno) => {
    const docRef = doc(db, "users", user?.uid);
    await updateDoc(docRef, {
      [`favourite.${srno}`]: deleteField(),
    });
  };
  useEffect(() => {
    if (user === null) navigate("/login");
  }, [user]);

  if (!user) {
    return;
  }
  if (data && Object.values(data[0].favourite).length === 0) {
    return (
      <>
        <nav className="m-5 flex items-center pb-3 border-b-2 border-solid border-primary ">
          <Link to={"/"}>
            <FaArrowLeft className=" w-5 h-5" />
          </Link>
          <div className="ml-5 text-xl  text-white">Your Favourite</div>
        </nav>
        <div className="flex flex-col items-center justify-center h-96">
          <div className="text-2xl text-primary text-center">
            Nothing added to favourite's yet.
          </div>
          <div className="text-2xl text-primary text-center">
            Add Items to Your Favourite List
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <nav className="m-5 flex items-center pb-3 border-b-2 border-solid border-primary ">
          <Link to={"/"}>
            <FaArrowLeft className=" w-5 h-5" />
          </Link>
          <div className="ml-5 text-xl  text-white">Your Favourite</div>
        </nav>
        <div className="flex flex-col">
          {data &&
            Object.values(data[0].favourite).map((product) => (
              <div key={product.srno}>
                <div className="flex gap-4 items-center mb-5  mx-2 md:mx-auto md:w-[600px] border-white/50 border p-3 rounded-lg">
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex justify-between items-center">
                      <img
                        src={coffee}
                        className="h-20 w-20 rounded-xl aspect-square"
                        alt="coffee"
                      />
                      <div className="hidden min-[400px]:flex flex-col gap-2">
                        <div className="text-end font-medium text-base  text-white">
                          {product.product}
                        </div>
                        <div className="flex justify-end text-base">{`₹ ${product.price}`}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start">
                      <div className="flex min-[400px]:hidden items-center gap-2">
                        <div className="text-end font-medium text-base  text-white">
                          {product.product}
                        </div>
                        <div className="flex justify-end text-base">{`₹ ${product.price}`}</div>
                      </div>
                      <div>{product.description}</div>
                    </div>
                  </div>
                  <MdDeleteOutline
                    onClick={() => handelDelete(product.srno)}
                    className="h-5 w-5 hover:text-red-500 hover:scale-110"
                  />
                </div>
              </div>
            ))}
        </div>
      </>
    );
  }
};

export default Favourite;
