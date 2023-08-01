import {
  collection,
  deleteField,
  doc,
  getDocs,
  increment,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import db from "../firebase";
import coffee from "../images/Coffee.jpg";
import nosearch from "../images/nosearch.png";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { UserContext } from "../context/AuthContext";
import hasItemInArray from "../utils/hasItemInArray";
import { toast } from "react-hot-toast";

const ProductFilter = () => {
  const { user } = useContext(UserContext);
  const [data, setData] = useState();
  const [searchdata, setSearchData] = useState();
  const [searching, setSearching] = useState(false);
  const [qty, setQty] = useState();
  const [price, setPrice] = useState();
  const [no, setNo] = useState(0);
  const [index, setIndex] = useState(0);
  const [favouriteName, setfavouriteName] = useState();
  const [favouritePrice, setfavouritePrice] = useState();
  const [favData, setFavData] = useState();

  useEffect(() => {
    getAllData();
  }, []);

  useEffect(() => {
    getFavData();
  }, [user]);

  const getFavData = async () => {
    const doc1 = doc(db, "users", user?.uid);
    console.log(doc1.docs);
    const docRef = query(
      collection(db, "users"),
      where("email", "==", user?.email)
    );
    onSnapshot(doc1, (snapshot) => {
      console.log();
      setFavData(Object.values(snapshot?.data().favourite));
    });
  };

  const getAllData = async () => {
    const alldata = [];

    const querySnapshotcoffee = await getDocs(collection(db, "coffee"));
    querySnapshotcoffee.forEach((doc) => {
      alldata.push({ ...doc.data(), id: doc.id });
    });

    const querySnapshotdeserts = await getDocs(collection(db, "deserts"));
    querySnapshotdeserts.forEach((doc) => {
      alldata.push({ ...doc.data(), id: doc.id });
    });

    const querySnapshotsnacks = await getDocs(collection(db, "snacks"));
    querySnapshotsnacks.forEach((doc) => {
      alldata.push({ ...doc.data(), id: doc.id });
    });

    setData(alldata);
  };

  const getCoffeType = async (type) => {
    onSnapshot(collection(db, type), (snapshot) => {
      setData(
        snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
  };

  const truncate = (input) =>
    input?.length > 75 ? `${input.substring(0, 75)}...` : input;

  const handelAddToCart = async (e) => {
    if (qty > 0) {
      const docRef = doc(db, "users", user?.uid);
      setDoc(
        docRef,
        {
          cart: {
            [`${no}`]: {
              srno: no,
              quantity: Number(qty),
              product: e.target.value,
              price: price * qty,
              actual_price: price,
            },
          },
        },
        { merge: true }
      );

      updateDoc(docRef, {
        cartvalue: increment(price * qty),
      });

      setQty(0);
      setNo(no + 1);
      document.querySelectorAll("#input").forEach((input) => {
        input.value = "";
      });
    }
  };

  const handelFavourite = async () => {
    const docRef = doc(db, "users", user?.uid);
    setDoc(
      docRef,
      {
        favourite: {
          [index]: {
            srno: index,
            product: favouriteName,
            price: favouritePrice,
          },
        },
      },
      { merge: true }
    );
    setNo(no + 1);
    toast(`${favouriteName} added to favourite`, {
      icon: "🤤",
    });
  };

  const handleSearch = (e) => {
    let itemList = [];
    setSearching(true);
    data?.map((item) => {
      if (e.target.value === "") {
        setSearchData("");
        setSearching(false);
      } else if (
        item.name
          .toLocaleLowerCase()
          .includes(e.target.value.toLocaleLowerCase())
      ) {
        itemList.push(item);
      }
      setSearchData(itemList);
    });
  };
  const handelDelete = async (e) => {
    const docRef = doc(db, "users", user?.uid);
    await updateDoc(docRef, {
      [`favourite.${index}`]: deleteField(),
    });
    toast.success(`${favouriteName} removed from favourite`);
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row mx-3 mt-20 justify-between">
        <div className="flex flex-row form-control md:grow">
          <input
            type="text"
            placeholder="Search categoty or menu"
            className="input text-white input-bordered border-primary grow"
            onChange={handleSearch}
          />
        </div>
        <div className="tabs tabs-boxed lg:ml-5 lg:mt-0  mt-5 h-14 bg-neutral items-center rounded-2xl">
          <div
            className="tab text-[14px] md:text-[16px] lg:text-xl text-white hover:text-primary active:text-warning px-2"
            onClick={getAllData}
          >
            All
          </div>
          <div
            className="tab text-[14px] md:text-[16px] lg:text-xl text-white hover:text-primary active:text-primary px-2"
            onClick={() => {
              getCoffeType("coffee");
            }}
          >
            Coffee
          </div>
          <div
            className="tab text-[14px] md:text-[16px] lg:text-xl text-white hover:text-primary active:text-primary px-2"
            onClick={() => {
              getCoffeType("deserts");
            }}
          >
            Deserts
          </div>
          <div
            className="tab text-[14px] md:text-[16px] lg:text-xl text-white hover:text-primary active:text-primary px-2"
            onClick={() => {
              getCoffeType("snacks");
            }}
          >
            Snacks
          </div>
        </div>
      </div>
      {searching ? (
        <div
          className={`flex flex-wrap  mt-10  justify-center items-center ${
            searching && searchdata.length === 0 && "justify-center"
          } `}
        >
          {searchdata.length === 0 ? (
            <div className="flex flex-col gap-4 justify-center items-center">
              <img
                src={nosearch}
                className="h-[300px] w-[350px]"
                alt="no-search"
              />
              <div className="text-[24px] font-[700]">
                No search results found
              </div>
            </div>
          ) : (
            searchdata.map((product, index) => (
              <div
                className="relative card w-full md:w-[320px] bg-neutral shadow-xl mb-5 mx-2 group"
                key={product.id}
              >
                {hasItemInArray(favData, product.name) ? (
                  <div
                    className="absolute  h-10 w-10  top-2 right-2 tooltip tooltip-left rounded-lg"
                    data-tip="Remove From Favourite"
                    onMouseEnter={() => {
                      setfavouriteName(product.name);
                      setfavouritePrice(product.price);
                      setIndex(product.srno);
                    }}
                    onTouchStart={() => {
                      setfavouriteName(product.name);
                      setfavouritePrice(product.price);
                      setIndex(product.srno);
                    }}
                  >
                    <div className="group/heart relative  h-10 w-10 flex justify-center items-center">
                      <AiFillHeart className="absolute top-auto left-auto md:hidden text-red-600  group-hover/heart:block  h-8 w-8 group-hover/heart:animate-ping" />
                      <AiFillHeart
                        value={product.srno}
                        onClick={handelDelete}
                        className="absolute top-0 left-0 text-red-600 md:hidden  group-hover:block  h-10 w-10"
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    className="absolute  h-10 w-10  top-2 right-2 tooltip tooltip-left rounded-lg"
                    data-tip="Add To Favourite"
                    onMouseEnter={() => {
                      setfavouriteName(product.name);
                      setfavouritePrice(product.price);
                      setIndex(product.srno);
                    }}
                    onTouchStart={() => {
                      setfavouriteName(product.name);
                      setfavouritePrice(product.price);
                      setIndex(product.srno);
                    }}
                  >
                    <div className="group/heart relative  h-10 w-10 flex justify-center items-center">
                      <AiOutlineHeart className="absolute top-auto left-auto md:hidden text-red-600  group-hover/heart:block  h-8 w-8 group-hover/heart:animate-ping" />
                      <AiOutlineHeart
                        className="absolute top-0 left-0 text-red-600 md:hidden  group-hover:block  h-10 w-10"
                        onClick={handelFavourite}
                      />
                    </div>
                  </div>
                )}

                <figure>
                  <img
                    src={coffee}
                    alt="coffee"
                    className=" w-full md:w-[320px] h-52"
                  />
                </figure>
                <div className="card-body flex flex-col justify-between items-center">
                  <h2 className="card-title text-white h-10 ">
                    {product.name}
                  </h2>
                  <div className="">
                    Description: {truncate(product.description)}
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
                        className=" grow rounded-lg pl-3 py-1 icon customInput"
                        required
                        onChange={(e) => {
                          setQty(e.target.value);
                        }}
                        autoComplete="off"
                      />
                    </div>
                    <button
                      className="btn btn-primary w-full"
                      value={product.name}
                      onMouseEnter={() => setPrice(product.price)}
                      onTouchStart={() => setPrice(product.price)}
                      onClick={handelAddToCart}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="flex flex-wrap mt-10 justify-center items-center">
          {data
            ? data.map((product) => (
                <div
                  className="relative card w-full md:w-[320px] bg-neutral shadow-xl mb-5 mx-2 group"
                  key={product.id}
                >
                  {hasItemInArray(favData, product.name) ? (
                    <div
                      className="absolute  h-10 w-10  top-2 right-2 tooltip tooltip-left rounded-lg"
                      data-tip="Remove From Favourite"
                      onMouseEnter={() => {
                        setfavouriteName(product.name);
                        setfavouritePrice(product.price);
                        setIndex(product.srno);
                      }}
                      onTouchStart={() => {
                        setfavouriteName(product.name);
                        setfavouritePrice(product.price);
                        setIndex(product.srno);
                      }}
                    >
                      <div className="group/heart relative  h-10 w-10 flex justify-center items-center">
                        <AiFillHeart className="absolute top-auto left-auto md:hidden text-red-600  group-hover/heart:block  h-8 w-8 group-hover/heart:animate-ping" />
                        <AiFillHeart
                          value={product.srno}
                          onClick={handelDelete}
                          className="absolute top-0 left-0 text-red-600 md:hidden  group-hover:block  h-10 w-10"
                        />
                      </div>
                    </div>
                  ) : (
                    <div
                      className="absolute  h-10 w-10  top-2 right-2 tooltip tooltip-left rounded-lg"
                      data-tip="Add To Favourite"
                      onMouseEnter={() => {
                        setfavouriteName(product.name);
                        setfavouritePrice(product.price);
                        setIndex(product.srno);
                      }}
                      onTouchStart={() => {
                        setfavouriteName(product.name);
                        setfavouritePrice(product.price);
                        setIndex(product.srno);
                      }}
                    >
                      <div className="group/heart relative  h-10 w-10 flex justify-center items-center">
                        <AiOutlineHeart className="absolute top-auto left-auto md:hidden text-red-600  group-hover/heart:block  h-8 w-8 group-hover/heart:animate-ping" />
                        <AiOutlineHeart
                          className="absolute top-0 left-0 text-red-600 md:hidden  group-hover:block  h-10 w-10"
                          onClick={handelFavourite}
                        />
                      </div>
                    </div>
                  )}

                  <figure>
                    <img
                      src={coffee}
                      alt="coffee"
                      className=" w-full md:w-[320px] h-52"
                    />
                  </figure>
                  <div className="card-body flex flex-col justify-between items-center">
                    <div>
                      <h2 className="card-title text-white h-10 ">
                        {product.name}
                      </h2>
                      <div className="">
                        Description: {truncate(product.description)}
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
                          className=" grow rounded-lg pl-3 py-1 icon customInput"
                          required
                          onChange={(e) => {
                            setQty(e.target.value);
                          }}
                          autoComplete="off"
                        />
                      </div>
                      <button
                        className="btn btn-primary w-full"
                        value={product.name}
                        onMouseEnter={() => setPrice(product.price)}
                        onTouchStart={() => setPrice(product.price)}
                        onClick={handelAddToCart}
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              ))
            : null}
        </div>
      )}
    </>
  );
};

export default ProductFilter;
