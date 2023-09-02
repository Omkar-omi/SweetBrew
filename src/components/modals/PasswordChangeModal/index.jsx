import Modal from "../../../commons/Modal";
import { useContext, useState } from "react";
import { UserContext } from "../../../context/AuthContext";
import { toast } from "react-hot-toast";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

const PasswordChangeModal = ({
  openModal,
  setOpenModal,
  isPending,
  setIsPending,
}) => {
  const { user } = useContext(UserContext);
  const [oldpass, setOldPass] = useState("");
  const [newpass, setNewPass] = useState("");
  const [error, setError] = useState("");
  const removeError = () => {
    setTimeout(() => {
      setError("");
    }, 4000);
  };

  const handelUpdatePassword = async (e) => {
    e.preventDefault();
    if (oldpass === "" || newpass === "") {
      toast.error("Please enter someting to proceed");
      return;
    }
    if (oldpass === newpass) {
      setError("Old password and new passowrd must be different");
      removeError();
      return;
    }
    const email = user?.email;
    const credential = await EmailAuthProvider.credential(email, oldpass);
    setIsPending(true);
    setError("");
    reauthenticateWithCredential(user, credential)
      .then(() => {
        updatePassword(user, newpass)
          .then(() => {
            setIsPending(false);
            setOldPass("");
            setNewPass("");
            setOpenModal(false);
            toast.success("Password change succesfull");
          })
          .catch((error) => {
            setError(error.message);
            removeError();
          });
      })
      .catch((error) => {
        setError("Wrong old Password Try again");
        console.error(error);
        setIsPending(false);
        removeError();
      });
  };

  const onClose = () => {
    // clear input fields if they have any unsaved inputs
    setOldPass("");
    setNewPass("");
  };
  return (
    <Modal
      openModal={openModal}
      setOpenModal={setOpenModal}
      longModal
      onClose={onClose}
    >
      <div className="p-4">
        <div className="text-lg text-red-600">{error}</div>
        <h3 className="font-bold text-lg">Edit Password</h3>
        <form>
          <label className="text-white mb-2">Old Password :</label>
          <input
            className="p-2 rounded-lg text-black w-full my-3 "
            value={oldpass}
            type="password"
            required
            autoComplete="current-password"
            onChange={(e) => setOldPass(e.target.value)}
          />

          <label className="text-white mb-2">New Password :</label>
          <input
            className="p-2 rounded-lg text-black w-full my-3 "
            value={newpass}
            type="password"
            required
            autoComplete="new-passowrd"
            onChange={(e) => setNewPass(e.target.value)}
          />
          {!isPending && (
            <button
              type="submit"
              className="btn w-full btn-primary"
              onClick={handelUpdatePassword}
            >
              Update Password
            </button>
          )}
          {isPending && (
            <div className="btn loading mt-5 mb-5 text-white btn-disabled w-full">
              Updating...
            </div>
          )}
        </form>
      </div>
    </Modal>
  );
};

export default PasswordChangeModal;
