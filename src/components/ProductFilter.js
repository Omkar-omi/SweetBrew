import "react-responsive-carousel/lib/styles/carousel.min.css";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import db from "../firebase";
import nosearch from "../images/nosearch.png";
import SkeletonLoader from "./SkeletonLoaders/SkeletonLoader";
import ProductCard from "./ProductCard/ProductCard";

const ProductFilter = () => {
  const [allProducts, setAllProducts] = useState();
  const [searchdata, setSearchData] = useState();
  const [searching, setSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    if ("startViewTransition" in document) {
      document.startViewTransition(() => {
        getAllData();
      });
    } else {
      getAllData();
    }
  }, []);

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

    setAllProducts(alldata);
    setIsLoading(false);
  };
  const getFilterByName = (type) => {
    onSnapshot(collection(db, type), (snapshot) => {
      setAllProducts(
        snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
  };
  // view transition api to filter by type
  const getCoffeType = async (type) => {
    if ("startViewTransition" in document) {
      document.startViewTransition(() => {
        getFilterByName(type);
      });
    } else {
      getFilterByName(type);
    }
  };

  // view transition api for search
  const serchTransitionAnimation = (value) => {
    let itemList = [];
    setSearching(true);
    allProducts?.map((item) => {
      if (value === "") {
        setSearchData("");
        setSearching(false);
      } else if (
        item.name.toLocaleLowerCase().includes(value.toLocaleLowerCase())
      ) {
        itemList.push(item);
      }
      setSearchData(itemList);
    });
  };

  const handleSearch = (e) => {
    if ("startViewTransition" in document) {
      document.startViewTransition(() => {
        serchTransitionAnimation(e.target.value);
      });
    } else {
      serchTransitionAnimation(e.target.value);
    }
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
            searchdata.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))
          )}
        </div>
      ) : (
        <>
          {isLoading ? (
            <div className="flex flex-wrap mt-10 justify-center items-center">
              {[...Array(8)].map((_, index) => (
                <SkeletonLoader key={index} />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap mt-10 justify-center items-center">
              {allProducts
                ? allProducts.map((product) => (
                    <ProductCard product={product} key={product.id} />
                  ))
                : null}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ProductFilter;
