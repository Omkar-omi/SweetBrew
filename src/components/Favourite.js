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
import { Link } from "react-router-dom";
import db from "../firebase";
import coffee from "../images/Coffee.jpg";
import { UserContext } from "../context/AuthContext";

const Favourite = () => {
  const { user } = useContext(UserContext);
  const [data, setData] = useState();

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

  const handelDelete = async (e) => {
    const docRef = doc(db, "users", user?.uid);
    const srno = e.target.value;
    console.log(srno);
    await updateDoc(docRef, {
      [`favourite.${srno}`]: deleteField(),
    });
  };
  if (data && Object.values(data[0].favourite).length === 0) {
    return (
      <>
        <nav className="m-5 flex  pb-3 border-b-2 border-solid border-primary ">
          <Link to={"/"}>
            <FaArrowLeft className=" w-5 h-5" />
          </Link>
          <div className="ml-5 text-xl  text-white">Your Favourite</div>
        </nav>
        <div className="flex items-center justify-center h-96">
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
        <div className="flex items-center flex-col">
          {data
            ? Object.values(data[0].favourite).map((product) => (
                <div key={product.srno}>
                  <div className="flex flex-col mb-5 w-80 md:w-[600px] border-solid border-2 p-3 rounded-lg">
                    <div className="md:mx-4 flex items-center">
                      <div className="flex grow">
                        <img
                          src={coffee}
                          className="h-20 w-20 rounded-xl "
                          alt="coffee"
                        />
                      </div>
                      <div>
                        <div className="text-end font-medium text-sm w-36 md:w-auto text-white md:text-xl my-2">
                          {" "}
                          {product.product}
                        </div>
                        <div className="flex justify-end text-sm md:text-xl my-2">{`₹ ${product.price}`}</div>
                      </div>
                      <div>
                        <button
                          className="btn ml-4"
                          value={product.srno}
                          onClick={handelDelete}
                        >
                          X
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : null}
        </div>
      </>
    );
  }
};

export default Favourite;
