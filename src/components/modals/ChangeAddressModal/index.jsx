import Modal from "../../../commons/Modal";
import { doc, setDoc } from "firebase/firestore";
import db from "../../../firebase";
import { FaHome } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/AuthContext";

const ChangeAddressModal = ({
  openModal,
  setOpenModal,
  address,
  setAddress,
}) => {
  const [newAddress, setNewAddress] = useState({
    flatno: address.flatno,
    area: address.area,
    landmark: address.landmark,
  });

  useEffect(() => {
    setNewAddress({
      flatno: address.flatno,
      area: address.area,
      landmark: address.landmark,
    });
  }, [openModal]);

  const onClose = () => {
    setNewAddress({
      flatno: address.flatno,
      area: address.area,
      landmark: address.landmark,
    });
  };
  const { user } = useContext(UserContext);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (newAddress.area === "" || newAddress.flatno === "") {
      toast.error("Enter a valid address");
      return;
    }
    const docRef = doc(db, "users", user?.uid);
    setDoc(
      docRef,
      {
        address: newAddress,
      },
      { merge: true }
    );
    toast.success("Address updated successfully");
    setAddress(newAddress);
    setOpenModal(false);
  };
  return (
    <Modal openModal={openModal} setOpenModal={setOpenModal} onClose={onClose}>
      <div className="p-4">
        <div className="text-primary text-[20px] font-bold">
          Update Delivery Address
        </div>
        <form>
          <div className="text-gray-200 mt-2 text-[14px]">
            Flat / House No. / Floor / Building:
          </div>
          <input
            maxLength={100}
            placeholder="Enter your Flat / House No. / Floor / Building"
            className="p-2 rounded-lg w-full text-black bg-white/90 placeholder:text-[14px] "
            value={newAddress.flatno}
            name="flatno"
            onChange={handleAddressChange}
          />
          <div
            className={`text-[12px] ml-auto w-max ${
              newAddress.flatno.length === 100 && "text-red-500"
            } ${
              newAddress.flatno.length < 100 &&
              newAddress.flatno.length > 70 &&
              "text-yellow-600"
            }`}
          >{`${newAddress.flatno.length}/100`}</div>
          <div className="text-gray-200 mt-2 text-[14px]">
            Area / Sector / Locality:
          </div>
          <textarea
            cols={10}
            maxLength={100}
            placeholder="Enter your  Area / Sector / Locality"
            className="p-2 rounded-lg w-full text-black bg-white/90 placeholder:text-[14px] h-[100px] resize-none"
            value={newAddress.area}
            name="area"
            onChange={handleAddressChange}
          />
          <div
            className={`text-[12px] ml-auto w-max ${
              newAddress.area.length === 100 && "text-red-500"
            } ${
              newAddress.area.length < 100 &&
              newAddress.area.length > 70 &&
              "text-yellow-600"
            }`}
          >{`${newAddress.area.length}/100`}</div>
          <div className="text-gray-200 mt-2 text-[14px]">
            {"Nearby Landmark (Optional)"}
          </div>
          <input
            maxLength={100}
            name="landmark"
            placeholder="Enter Nearby Landmark (Optional)"
            className="p-2 rounded-lg w-full text-black bg-white/90 placeholder:text-[14px] "
            value={newAddress.landmark}
            onChange={handleAddressChange}
          />
          <div
            className={`text-[12px] ml-auto w-max ${
              newAddress.landmark.length === 100 && "text-red-500"
            } ${
              newAddress.landmark.length < 100 &&
              newAddress.landmark.length > 70 &&
              "text-yellow-600"
            }`}
          >{`${newAddress.landmark.length}/100`}</div>

          <button
            type="submit"
            className="btn btn-primary  mt-4 w-full"
            htmlFor="addAddress-modal"
            onClick={handleAddAddress}
          >
            Update Address&nbsp;
            <FaHome />
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default ChangeAddressModal;
