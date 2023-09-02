import Modal from "../../../commons/Modal";
import { doc, updateDoc } from "firebase/firestore";
import db from "../../../firebase";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/AuthContext";
import { toast } from "react-hot-toast";

const NameChangeModal = ({ openModal, setOpenModal, name }) => {
  const [editname, setEditName] = useState("");
  const { user } = useContext(UserContext);

  useEffect(() => {
    setEditName(name);
  }, [openModal]);

  const handelEditName = () => {
    const docRef = doc(db, "users", user?.uid);
    updateDoc(docRef, {
      name: editname,
    });
    toast.success(`Name change Succesfull`);
    setEditName("");
    setOpenModal(false);
  };

  return (
    <Modal openModal={openModal} setOpenModal={setOpenModal} longModal>
      <div className="p-4">
        <h3 className="font-bold text-lg">Edit Name</h3>
        <form>
          <label className="text-white mb-2">Name :</label>
          <input
            className="p-2 rounded-lg text-black w-full my-3"
            type="text"
            autoFocus
            value={editname}
            required
            onChange={(e) => setEditName(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-primary"
            onClick={handelEditName}
          >
            Save
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default NameChangeModal;
