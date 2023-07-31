import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { useState } from "react";
import { FaArrowLeft, FaHome } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { MdModeEdit } from "react-icons/md";
import { useEffect } from "react";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import db from '../firebase'

const Profile = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [editname, setEditName] = useState("");
  const [editaddress, setEditAddress] = useState("");
  const [oldpass, setOldPass] = useState('');
  const [newpass, setNewPass] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    onSnapshot(doc(db, "users", localStorage.getItem("id")), (doc) => {
      setName(doc.data().name)
      setEmail(doc.data().email)
      setAddress(doc.data().address)
    })
  }
  const handleAddAddress = () => {
    const docRef = doc(db, "users", localStorage.getItem("id"))
    setDoc(docRef, {
      address: address
    }, { merge: true })
  }

  const handelEditName = () => {
    const docRef = doc(db, "users", localStorage.getItem("id"))
    updateDoc(docRef, {
      name: editname
    })
    localStorage.removeItem("name")
    localStorage.setItem("name", editname)
    setEditName("")
  }
  const handelEditAddress = () => {
    const docRef = doc(db, "users", localStorage.getItem("id"))
    updateDoc(docRef, {
      address: editaddress
    })
    setEditAddress("")
  }

  const handelSaveChanges = async (e) => {
    e.preventDefault()
    setIsPending(true)
    try {
      setTimeout(() => {
        navigate("/")
        setIsPending(false)
      }, 1000)
    } catch (e) {
      setIsPending(false)
    }
  }
  const handelUpdatePassword = async () => {
    const email = user.email
    const credential = await EmailAuthProvider.credential(
      email,
      oldpass
    );
    setIsPending(true)
    setError("")
    reauthenticateWithCredential(user, credential)
      .then(() => {
        updatePassword(user, newpass)
          .then(() => {
            setIsPending(false)
            setSuccess("Update successful.")
            setOldPass("")
            setNewPass("")
          }).catch((error) => {
            setError(error.message)
          });
      }).catch((error) => {
        setError("Wrong old Password Try again")
        console.error(error);
        setIsPending(false)
      });
  }
  return (
    <div className="flex flex-col ">
      <nav className="inline-block m-5 ">
        <Link to={"/"} className="content-center"  ><FaArrowLeft className="w-5 h-5" /></Link>
      </nav>
      <main className="flex  justify-center">
        <form className="flex flex-col justify-center mx-5 " onSubmit={handelSaveChanges} >
          <h2 className="text-2xl flex justify-center mb-10 text-white">Profile</h2>
          <label className="text-white mb-2" >Name :</label>
          <div className="flex gap-3">
            <input className="p-2 rounded-lg text-black w-64 md:w-[450px]  " type="text" required value={name} readOnly={true} autoComplete="off" />
            <label className="btn bg-neutral" htmlFor="name-modal" ><MdModeEdit className="w-5 h-5" /></label>
          </div>
          <label className="text-white mb-2">Email :</label>
          <div className="flex gap-3 items-center">
            <input className="rounded-lg p-2 text-black w-64 md:w-[450px] " type="email" required value={email} readOnly={true} />
            <div className="text-xs text-red-500 w-12">Email can't be changed*</div>
          </div>
          {!address && <label className="btn btn-primary mt-5" htmlFor="addAddress-modal">Add Address&nbsp;<FaHome /></label>}
          {address && <label className="text-white mb-2">Address :</label>}
          {address && <div className="flex gap-3">
            <input className="p-2 rounded-lg text-black w-64 md:w-[450px] " type="text" required value={address} readOnly={true} />
            <label className="btn bg-neutral" htmlFor="address-modal"><MdModeEdit className="w-5 h-5" /></label>
          </div>}
          <label className="btn btn-primary mt-5" htmlFor="pass-modal"><MdModeEdit className="w-5 h-5" />Change Password</label>
          {!isPending && <button className="btn btn-primary mt-5 mb-5 w-80 md:w-[516px]">Save Changes</button>}
          {isPending && <button className="btn loading mt-5 mb-5 text-white btn-disabled w-80 md:w-[516px]" >Saving...</button>}
        </form>
      </main>

      {/* Modals */}
      <input type="checkbox" id="addAddress-modal" className="modal-toggle" />
      <div className="modal modal-middle">
        <div className="modal-box">
          <label htmlFor="addAddress-modal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
          <h3 className="font-bold text-lg">Add Address</h3>
          <label className="text-white mb-2">Address :</label>
          <div className="flex gap-3">
            <textarea className="p-2 rounded-lg text-black w-64 sm:w-[450px] h-24 " type="email" required onChange={(e) => setAddress(e.target.value)} />
          </div>
          <label htmlFor="addAddress-modal" className="btn my-3 btn-primary" onClick={handleAddAddress}>Save</label>
        </div>
      </div>
      {/* Name modals */}
      <input type="checkbox" id="name-modal" className="modal-toggle" />
      <div className="modal modal-middle">
        <div className="modal-box">
          <label htmlFor="name-modal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
          <h3 className="font-bold text-lg">Edit Name</h3>
          <label className="text-white mb-2">Name :</label>
          <input className="p-2 rounded-lg text-black w-64 sm:w-[450px] my-3" type="text" value={editname} required onChange={(e) => setEditName(e.target.value)} />
          <label htmlFor="name-modal" className="btn btn-primary" onClick={handelEditName}>Save</label>
        </div>
      </div>
      {/* address modals */}
      <input type="checkbox" id="address-modal" className="modal-toggle" />
      <div className="modal modal-middle">
        <div className="modal-box">
          <label htmlFor="address-modal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
          <h3 className="font-bold text-lg">Edit Address</h3>
          <label className="text-white mb-2">Address :</label>
          <input className="p-2 rounded-lg text-black w-64 sm:w-[450px] my-3" type="text" value={editaddress} required onChange={(e) => setEditAddress(e.target.value)} />
          <label htmlFor="address-modal" className="btn btn-primary" onClick={handelEditAddress}>Save</label>
        </div>
      </div>
      {/* Pass change modal */}
      <input type="checkbox" id="pass-modal" className="modal-toggle" />
      <div className="modal modal-middle">
        <div className="modal-box">
          <label htmlFor="pass-modal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
          <div className="text-lg text-red-600">{error}</div>
          <div className="text-lg text-green-600">{success}</div>
          <h3 className="font-bold text-lg">Edit Password</h3>
          <label className="text-white mb-2">Old Password :</label>
          <input className="p-2 rounded-lg text-black w-64 sm:w-[450px] my-3 " value={oldpass} type="password" required onChange={(e) => setOldPass(e.target.value)} /><br />
          <label className="text-white mb-2">New Password :</label>
          <input className="p-2 rounded-lg text-black w-64 sm:w-[450px] my-3 " value={newpass} type="password" required onChange={(e) => setNewPass(e.target.value)} />
          {!isPending && <button htmlFor="pass-modal" className="btn w-64 sm:w-[450px] btn-primary" onClick={handelUpdatePassword}>Update Password</button>}
          {isPending && <button className="btn loading mt-5 mb-5 text-white btn-disabled w-64 md:w-[516px]" >Updating...</button>}
        </div>
      </div>
    </div >
  );
}

export default Profile;