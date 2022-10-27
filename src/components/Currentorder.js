import { collection, documentId, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import coffee from '../images/Coffee.jpg'
import db from '../firebase'
import { UserAuth } from "../context/AuthContext";


const CurrentOrder = (props) => {
  const { user } = UserAuth();
  const { name } = props

  useEffect(() => {
    getData()
    console.log(user.displayName);
    console.log(data);
  }, [])



  const [data, setData] = useState();
  const getData = async () => {
    const docRef = query(collection(db, "users"), where("name", "==", "Omkar"));
    onSnapshot(docRef, (snapshot) => {
      setData(snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })))
    })
  }

  return (
    <div className="sm:block hidden bg-neutral p-10 w-96 ">
      <div className="text-2xl text-gray-400 font-semibold mb-7" >Current Order</div>
      <div className="flex flex-col ">
        <div className="overflow-y-scroll scroll-m-4 snap-start h-96 border-solid border-b-2 border-primary scrollbar" >{/* outer div */}
          {data ? data[0].cart.map((product, index) =>
            <div className="flex flex-row mb-5" key={product.srno}>
              < img src={coffee} className="h-20 w-20 rounded-xl" alt="coffee" />
              <div className="mx-4">
                <div className='font-medium text-white'>{product.product}</div>
                <div className="flex flex-row  mt-5">
                  <div className='text-warning mr-14'>{`${product.quantity} X`}</div>
                  <div>{`₹ ${product.price}`}</div>
                </div>
              </div>
            </div>
          ) : null
          }
        </div>
        <div className="mt-11">
          <div className="flex flex-row justify-between border-solid border-b-2 border-primary pb-5">
            <div className=''>
              <div>Subtotal:</div>
              <div>CGST 9%:</div>
              <div>SGST 9%:</div>
            </div>
            <hr />
            <div>
              {data ? data.map(product =>
                <div key={0}>
                  <div  >{`₹ ${product.cartvalue}`}</div>
                  <div>{`₹ ${(product.cartvalue / 100) * 9}`}</div>
                  <div>{`₹ ${(product.cartvalue / 100) * 9}`}</div>
                </div>
              ) : null
              }
            </div>
          </div>
          <div className="flex flex-row justify-between my-5">
            <div className='font-medium text-xl'>Total:</div>
            {data ? data.map(product =>
              <div key={1}>{`₹ ${product.cartvalue + (product.cartvalue / 100) * 18}`}</div>
            ) : null
            }
          </div>
          <div className="flex">
            <button className="btn btn-primary grow">Check Out</button>
          </div>
        </div>
      </div>
    </div >

  );
}

export default CurrentOrder;
