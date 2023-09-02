import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { useContext, useState } from "react";
import { FaArrowLeft, FaHome } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { MdModeEdit } from "react-icons/md";
import { useEffect } from "react";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import db from "../firebase";
import { UserContext } from "../context/AuthContext";
import ChangeAddressModal from "../components/modals/ChangeAddressModal";
import NameChangeModal from "./modals/NameChangeModal";

const Profile = () => {
  const { user } = useContext(UserContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState({
    flatno: "",
    area: "",
    landmark: "",
  });

  const [isPending, setIsPending] = useState(false);
  const [oldpass, setOldPass] = useState("");
  const [newpass, setNewPass] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [openNameChangeModal, setOpenNameChangeModal] = useState(false);

  useEffect(() => {
    if (user) getData();
  }, [user]);

  const getData = async () => {
    onSnapshot(doc(db, "users", user?.uid), (doc) => {
      setName(doc.data().name);
      setEmail(doc.data().email);
      setAddress(doc.data().address);
    });
  };

  const handelSaveChanges = async (e) => {
    e.preventDefault();
    setIsPending(true);
    try {
      setTimeout(() => {
        navigate("/");
        setIsPending(false);
      }, 1000);
    } catch (e) {
      setIsPending(false);
    }
  };
  const handelUpdatePassword = async () => {
    const email = user?.email;
    const credential = await EmailAuthProvider.credential(email, oldpass);
    setIsPending(true);
    setError("");
    reauthenticateWithCredential(user, credential)
      .then(() => {
        updatePassword(user, newpass)
          .then(() => {
            setIsPending(false);
            setSuccess("Update successful.");
            setOldPass("");
            setNewPass("");
          })
          .catch((error) => {
            setError(error.message);
          });
      })
      .catch((error) => {
        setError("Wrong old Password Try again");
        console.error(error);
        setIsPending(false);
      });
  };

  useEffect(() => {
    if (user === null) navigate("/login");
  }, [user]);

  if (!user) {
    return;
  }
  return (
    <div className="flex flex-col ">
      <nav className="inline-block m-5 ">
        <Link to={"/"} className="content-center">
          <FaArrowLeft className="w-5 h-5" />
        </Link>
      </nav>
      <main className="flex  justify-center">
        <form
          className="flex flex-col justify-center mx-5 "
          onSubmit={handelSaveChanges}
        >
          <h2 className="text-2xl flex justify-center mb-10 text-white">
            Profile
          </h2>
          <label className="text-white mb-2">Name :</label>
          <div className="flex gap-3">
            <input
              className="p-2 rounded-lg text-black w-64 md:w-[450px]  "
              type="text"
              required
              value={name}
              readOnly={true}
              autoComplete="off"
            />
            <div
              onClick={() => setOpenNameChangeModal(true)}
              className="btn bg-neutral"
            >
              <MdModeEdit className="w-5 h-5" />
            </div>
          </div>
          <label className="text-white mb-2">Email :</label>
          <div className="flex gap-3 items-center">
            <input
              className="rounded-lg p-2 text-black w-64 md:w-[450px] "
              type="email"
              required
              value={email}
              readOnly={true}
            />
            <div className="text-xs text-red-500 w-12">
              Email can't be changed*
            </div>
          </div>

          {address.area === "" || address.flatno === "" ? (
            <div
              onClick={() => setOpenModal(true)}
              className="btn btn-primary mt-5"
            >
              Add Address&nbsp;
              <FaHome />
            </div>
          ) : (
            <>
              <label className="text-white mb-2">Address :</label>
              <div className="flex gap-3">
                <input
                  className="p-2 rounded-lg text-black w-64 md:w-[450px] "
                  type="text"
                  required
                  value={
                    address &&
                    `${address && address?.flatno?.trim()}, ${
                      address && address?.area?.trim()
                    }, ${address && address?.landmark?.trim()} `
                  }
                  readOnly
                />
                <div
                  onClick={() => setOpenModal(true)}
                  className="btn bg-neutral"
                >
                  <MdModeEdit className="w-5 h-5" />
                </div>
              </div>
            </>
          )}
          <label className="btn btn-primary mt-5" htmlFor="pass-modal">
            <MdModeEdit className="w-5 h-5" />
            Change Password
          </label>
          {!isPending && (
            <button className="btn btn-primary mt-5 mb-5 w-80 md:w-[516px]">
              Save Changes
            </button>
          )}
          {isPending && (
            <button className="btn loading mt-5 mb-5 text-white btn-disabled w-80 md:w-[516px]">
              Saving...
            </button>
          )}
        </form>
      </main>

      {/* Name modals */}
      <NameChangeModal
        openModal={openNameChangeModal}
        setOpenModal={setOpenNameChangeModal}
        name={name}
      />
      {address && (
        <ChangeAddressModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          address={address}
          setAddress={setAddress}
        />
      )}
      {/* Pass change modal */}
      <input type="checkbox" id="pass-modal" className="modal-toggle" />
      <div className="modal modal-middle">
        <div className="modal-box">
          <label
            htmlFor="pass-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <div className="text-lg text-red-600">{error}</div>
          <div className="text-lg text-green-600">{success}</div>
          <h3 className="font-bold text-lg">Edit Password</h3>
          <label className="text-white mb-2">Old Password :</label>
          <input
            className="p-2 rounded-lg text-black w-64 sm:w-[450px] my-3 "
            value={oldpass}
            type="password"
            required
            onChange={(e) => setOldPass(e.target.value)}
          />
          <br />
          <label className="text-white mb-2">New Password :</label>
          <input
            className="p-2 rounded-lg text-black w-64 sm:w-[450px] my-3 "
            value={newpass}
            type="password"
            required
            onChange={(e) => setNewPass(e.target.value)}
          />
          {!isPending && (
            <button
              htmlFor="pass-modal"
              className="btn w-64 sm:w-[450px] btn-primary"
              onClick={handelUpdatePassword}
            >
              Update Password
            </button>
          )}
          {isPending && (
            <button className="btn loading mt-5 mb-5 text-white btn-disabled w-64 md:w-[516px]">
              Updating...
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
