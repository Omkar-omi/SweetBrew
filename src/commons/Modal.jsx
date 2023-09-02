import { motion } from "framer-motion";
import { useEffect } from "react";
import { blurTransition, viewPort } from "../constants/animations";
import { MdClose } from "react-icons/md";

const Modal = ({
  openModal,
  setOpenModal,
  background = "#000000",
  children,
  onClose,
  longModal,
}) => {
  useEffect(() => {
    document.body.style.overflow = openModal ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openModal]);

  if (!openModal) {
    return null;
  }

  return (
    <motion.div
      initial={blurTransition.initialState}
      whileInView={blurTransition.viewTransition}
      viewport={viewPort}
      exit={{ opacity: 0 }}
      className="flex justify-center items-center py-10 fixed transition-all duration-200 bg-black/10 backdrop-blur-sm h-screen w-screen left-0 bottom-0 right-0 z-50"
    >
      <div
        className={`relative flex transition-all duration-200 delay-100 pb-4 pt-5 sm:mx-0 ${
          longModal
            ? " w-[450px] sm:max-w-[450px]"
            : " w-[300px] sm:max-w-[350px]"
        } sm:w-full z-10`}
        style={{
          background,
          boxShadow: "10px 10px 0px 0px rgba(220, 148, 76, 0.15)",
        }}
      >
        <div className="absolute right-[-10px] sm:right-[-20px] top-[-20px] cursor-pointer z-20">
          <button
            className="border h-10 w-10 rounded-2xl border-primary bg-black "
            onClick={() => {
              setOpenModal(!openModal);
              if (onClose) onClose();
            }}
          >
            <MdClose className="h-5 w-5 mx-auto " />
          </button>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative flex-grow flex w-full h-full"
        >
          <div className="w-full flex flex-col max-h-[80vh] overflow-y-auto custom-scrollbar">
            {children}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Modal;
