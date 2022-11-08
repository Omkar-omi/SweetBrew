import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import db from '../firebase'
import coffee from '../images/Coffee.jpg'

const Favourite = () => {
  const [data, setData] = useState();

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    const docRef = query(collection(db, "users"), where("name", "==", localStorage.getItem("name")));
    onSnapshot(docRef, (snapshot) => {
      setData(snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })))
    })
  }
  return (
    <>
      <nav className="m-5 flex  pb-3 border-b-2 border-solid border-primary ">
        <Link to={"/"}><FaArrowLeft className=" w-5 h-5" /></Link>
        <div className="ml-5 text-xl  text-white">Your Favourite</div>
      </nav>
      <ol className="flex items-center flex-col  list-decimal marker:text-primary marker:text-xl">
        {data ? Object.values(data[0].favourite).map((product, index) =>
          <li key={index}>
            <div className="flex flex-col mb-5 w-72 md:w-[600px] border-solid border-2 p-3 rounded-lg">
              <div className="md:mx-4 flex">
                <div className="flex grow">
                  <img src={coffee} className="h-20 w-24 rounded-xl " alt="coffee" />
                </div>
                <div>
                  <div className='text-end font-medium text-sm w-40 md:w-auto text-white md:text-xl my-2'> {product.product}</div>
                  <div className="flex justify-end text-sm md:text-xl my-2">{`₹ ${product.price}`}</div>
                </div>
              </div>
            </div>
          </li>) : null}
      </ol>
    </>
  );
}

export default Favourite;