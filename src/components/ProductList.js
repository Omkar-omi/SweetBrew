import { arrayUnion, collection, doc, increment, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import db from '../firebase'
import coffee from '../images/Coffee.jpg'
const ProductList = () => {
  const { user } = UserAuth();

  useEffect(() => {
    getData()
  }, [])

  const [data, setData] = useState();
  const getData = async () => {
    onSnapshot(collection(db, "coffee"), (snapshot) => {
      setData(snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })))
    })

  }
  const truncate = (input) => input?.length > 75 ? `${input.substring(0, 75)}...` : input;

  const [qty, setQty] = useState();
  const [price, setPrice] = useState();
  const [no, setNo] = useState(0);

  const handelAddToCart = async (e) => {
    if (qty > 0) {
      const docRef = doc(db, "users", user.uid)
      updateDoc(docRef, {
        cart: arrayUnion({
          srno: no,
          quantity: qty,
          product: e.target.value,
          price: price * qty
        }),
        cartvalue: increment(qty * price),
      })
      setQty(0)
      setNo(no + 1)
      document.querySelectorAll("#input").forEach(input => {
        input.value = ""
      })
    }
    // to-do
    // } else {
    //   setAlert(true)
    //   setTimeout(() => {
    //     setAlert(false)
    //   }, 5000)

    // }
  }

  return (
    <div className="grid lg:grid-cols-2 xl:grid-cols-3 grid-cols-1 mt-10 justify-items-center ">
      {data ? data.map(product =>
        <div className="card w-80 lg:w-80 bg-neutral shadow-xl mb-5" key={product.id}>
          <figure><img src={coffee} alt="coffee" className="w-80 h-52" /></figure>
          <div className="card-body">
            <h2 className="card-title text-white  ">{product.name}</h2>
            <div className="">Description: {truncate(product.description)}</div>
            <div className="card-actions flex">
              <div className="text-green-600 text-lg">Price: ₹ {product.price}</div>
              <input type="number" min={0} max={100} id="input" placeholder="Enter Quantity" className="grow rounded-lg pl-3 py-1" required onChange={(e) => {
                setQty(e.target.value)
                setPrice(product.price)
              }} />
            </div>
            <button className="btn btn-primary" value={product.name} onClick={handelAddToCart}>Add to cart</button>
          </div>
        </div>
      ) : null
      }
    </div >
  )
}
export default ProductList;
