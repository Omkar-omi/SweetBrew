import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaHome } from "react-icons/fa";
import { addDoc, collection, doc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import coffee from '../images/Coffee.jpg'
import db from '../firebase'
import { BsInfoCircle, BsCreditCard2Back } from "react-icons/bs";
import { CgGoogle } from "react-icons/cg";

const Checkout = () => {
  const [data, setData] = useState();
  const [address, setAddress] = useState('');
  const [newaddress, setNewAddress] = useState('');
  const [paymentmethod, setPaymentMethod] = useState('');
  const [deliverymethod, setDeliveryMethod] = useState(false);
  const [area, setArea] = useState('');
  const [pincode, setPincode] = useState('');
  const [discount, setDiscount] = useState(false);
  const [extracharges, setExtraCharges] = useState(false);
  const [isPending, setIsPending] = useState(false)
  const [delivery, setDelivery] = useState('');
  const [cart, setCart] = useState();
  const [cartvalue, setCartvalue] = useState();
  const navigate = useNavigate();

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

    const querySnapshotaddress = await getDocs(docRef);
    querySnapshotaddress.forEach((doc) => {
      setAddress(doc.data().address)
      setCart(doc.data().cart)
      setCartvalue(doc.data().cartvalue)
    });

  }
  const handleAddAddress = () => {
    const docRef = doc(db, "users", localStorage.getItem("id"))
    setDoc(docRef, {
      address: address
    }, { merge: true })
  }
  const handelCheckout = async () => {
    setIsPending(true)
    if (deliverymethod && paymentmethod && address) {
      const docRef = await addDoc(collection(db, "orders"), {
        name: localStorage.getItem("name"),
        address: address,
        cart: cart,
        email: localStorage.getItem("email"),
        paymentmethod: paymentmethod,
        deliverymethod: delivery,
      });
      if (extracharges == true) {
        updateDoc(doc(db, "orders", docRef.id), {
          cartvalue: (Number((cartvalue + (cartvalue / 100) * 18) + 40).toFixed(2)),
        })
      } else {
        updateDoc(doc(db, "orders", docRef.id), {
          cartvalue: (Number((cartvalue + (cartvalue / 100) * 18) - 10).toFixed(2)),
        })
      }
      await updateDoc(doc(db, "users", localStorage.getItem("id")), {
        cart: {},
        cartvalue: 0
      })
      setTimeout(() => {
        navigate("/")
      }, 1000)
    }
    else {
      alert("select all the options")
      setIsPending(false)
    }
  }

  return (
    <>
      <nav className="m-5 flex gap-5 justify-between border-b-2 border-primary pb-3 ">
        <div className="flex gap-5 md:gap-10 items-center">
          <Link to={"/"} className="content-center"  ><FaArrowLeft className="w-5 h-5" /></Link>
          <div className="text-primary text-2xl md:text-3xl">Order Overview</div>
        </div>
        <div className="hidden md:block mr-5">
          <ul className="steps gap-4">
            {!deliverymethod && <li className="step ">Delivery Method</li>}
            {deliverymethod && <li className="step step-primary" data-content="✓">Delivery Method</li>}
            {!address && <li className="step ">Delivery Address</li>}
            {address && <li className="step step-primary" data-content="✓">Delivery address</li>}
            {!paymentmethod && <li className="step ">Payment Method</li>}
            {paymentmethod && <li className="step step-primary" data-content="✓">Payment Method</li>}
          </ul>
        </div>
      </nav>
      <div className="flex md:flex-row flex-col justify-center mb-4">
        <div className="pl-5 pr-5 lg:pl-40 pt-5 lg:pr-10 md:border-solid md:border-r-2 border-primary">
          <div>
            <div className="text-white font-bold text-2xl">Summary Order</div>
            <div className="text-gray-200 w-80 font-medium my-2">Check your items and select your shipping according to your choice.</div>
          </div>
          <div>
            <div className="overflow-y-scroll h-80 border-solid border-b-2 border-primary scrollbar p-2">
              {data ? data.length > 0 ? Object.values(data[0].cart).map((product) =>
                <div className="flex flex-row mb-5" key={product.srno}>
                  < img src={coffee} className="h-20 w-20 rounded-xl" alt="coffee" />
                  <div className="mx-4 flex flex-col grow">
                    <div className='flex items-baseline justify-between'>
                      <div className='text-sm md:text-lg text-white'>{product.product}</div>
                    </div>
                    <div className="flex flex-row  mt-2 justify-between">
                      <div className='text-sm md:text-lg text-warning'>{`${product.quantity} X`}</div>
                      <div className="text-sm md:text-lg">{`₹ ${product.price}`}</div>
                    </div>
                  </div>
                </div>
              ) : null : null}
            </div>
          </div>
          <div className="flex flex-col text-gray-200">
            <div className="font-medium mt-4">Available Shipping Methods </div>
            <div className="flex flex-col md:flex-row" >
              <input type='radio' value='1' name='radio' id='radiofast' className="radiocustom" />
              <label htmlFor='radiofast' className="labelcustom hover:outline outline-2 outline-primary w-72 p-3" onClick={(e) => {
                setExtraCharges(true)
                setDiscount(false)
                setDeliveryMethod(true)
                setDelivery("Fast")
              }} >
                <div className="flex  ">
                  <div className="felx flex-col">
                    <div>Fast/Expidited Delivery</div>
                    <div className="text-sm">In a hurry? Select this.</div>
                  </div>
                  <div className="ml-5">+ ₹40</div>
                </div>
              </label>
              <input type='radio' value='2' name='radio' id='radioslow' className="radiocustom" />
              <label htmlFor='radioslow' className="labelcustom hover:outline outline-2 outline-primary w-72 p-3" onClick={(e) => {
                setDiscount(true)
                setExtraCharges(false)
                setDeliveryMethod(true)
                setDelivery("Normal")
              }}>
                <div className="flex">
                  <div className="felx flex-col">
                    <div>Normal speed Delivery</div>
                    <div className="text-sm ">Not in a hurry?</div>
                  </div>
                  <div className="ml-5">- ₹10</div>
                </div>
              </label>
            </div>
          </div>
        </div>
        <div className="pl-5 pr-5 lg:pr-40 pt-5 lg:pl-10 ">
          <div>
            <div className="font-bold text-white text-3xl">Payment Details</div>
            <div className="font-medium my-2 text-gray-200 w-80">Complete your purchase by profiding your payment details below.</div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-200 mb-2">Email Address:</label>
            <input type="text" className="p-2 rounded-lg border-solid border-4 border-green-400" id="email" value={localStorage.getItem("email")} readOnly={true} />
          </div>
          <div className="flex flex-col">
            <div className="text-gray-200 my-2">Delivery Address</div>
            {address && <input type="text" className="p-2 rounded-lg border-solid border-4 border-green-400" value={address} readOnly={true} />}
            {!address && <input type="text" className="p-2 rounded-lg" value={newaddress} onChange={(e) => setNewAddress(e.target.value)} />}
            {!address && <label className="btn btn-primary md:ml-5 mt-4" htmlFor="addAddress-modal" onClick={handleAddAddress}>Add Address&nbsp;<FaHome /></label>}
            <div className="flex flex-col  md:flex-row justify-between mt-4 gap-2">
              <input type="text" className="p-2 rounded-lg" placeholder="Area (Optional)" value={area} onChange={(e) => setArea(e.target.value)} />
              <input type="text" className="p-2 rounded-lg mt-4 md:mt-0" placeholder="Pincode (Optional)" value={pincode} onChange={(e) => setPincode(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-row justify-between border-solid border-b-2 border-primary pb-5 mt-4 text-gray-200">
            <div>
              <div className="tooltip" data-tip="Subtotal Excluding Tax">
                <div>Subtotal:<BsInfoCircle className="inline ml-2" /></div>
              </div>
              <div>CGST 9%:</div>
              <div>SGST 9%:</div>
              {discount && <div > Discount:</div>}
              {extracharges && <div>{`Extra charges: (Fast Delivery)`}</div>}
              <div>Total:</div>
            </div>
            <hr />
            <div>
              {data ? data.map(product =>
                <div key={0}>
                  <div  >{`₹ ${product.cartvalue}.0`}</div>
                  <div>₹ {Number((product.cartvalue / 100) * 9).toFixed(2)}</div>
                  <div>₹ {Number((product.cartvalue / 100) * 9).toFixed(2)}</div>
                  {discount && <div > - ₹10</div>}
                  {extracharges && <div>₹40</div>}
                  {discount && <div>₹ {Number((product.cartvalue + (product.cartvalue / 100) * 18) - 10).toFixed(2)}</div>}
                  {extracharges && <div>₹ {Number((product.cartvalue + (product.cartvalue / 100) * 18) + 40).toFixed(2)}</div>}
                </div>
              ) : null
              }
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5 mt-4">
            <div onClick={(e) => setPaymentMethod("Gpay")}>
              <input type='radio' value='3' name='paymentmethod' id='radio-gpay' className="radiocustom w-0" />
              <label htmlFor='radio-gpay' className="labelcustom  hover:outline outline-2 outline-primary p-2 md:p-2 text-base md:text-2xl justify-items-center text-gray-300"><CgGoogle className="inline-flex text-3xl" />Pay / UPI</label>
            </div>
            <div onClick={(e) => setPaymentMethod("Debit Card")}>
              <input type='radio' value='3' name='paymentmethod' id='radio-db' className="radiocustom w-0" />
              <label htmlFor='radio-db' className=" labelcustom hover:outline outline-2 outline-primary p-2 md:p-3 text-base md:text-lg text-gray-300"><BsCreditCard2Back className="mr-2 inline-flex text-3xl" />Debit Card</label>
            </div>
            <div onClick={(e) => setPaymentMethod("Credit Card")} >
              <input type='radio' value='3' name='paymentmethod' id='radio-cd' className="radiocustom w-0" />
              <label htmlFor='radio-cd' className=" labelcustom hover:outline outline-2 outline-primary p-2 md:p-3 text-base md:text-lg text-gray-300"><BsCreditCard2Back className="mr-2 inline-flex text-3xl" />Credit Card</label>
            </div>
            <div onClick={(e) => setPaymentMethod("Cash On Delivery")}>
              <input type='radio' value='3' name='paymentmethod' id='radio-cod' className="radiocustom w-0" />
              <label htmlFor='radio-cod' className="labelcustom hover:outline outline-2 outline-primary text-base md:text-lg p-2 md:p-3  text-gray-300"  >Cash On Delivery</label>
            </div>
          </div>
          <div className="flex mt-4">
            {isPending && <button className="content-center btn btn-primary grow loading">Checking Out...</button>}
            {!isPending && <button className="content-center btn btn-primary grow" onClick={handelCheckout}> Check Out</button>}
          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;