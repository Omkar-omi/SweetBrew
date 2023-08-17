import { Carousel } from "react-responsive-carousel";
import coffee from "../../../images/Coffee.jpg";
import Modal from "../../../commons/Modal";

const ProductInfoModal = ({ openModal, setOpenModal, selectedProduct }) => {
  return (
    <Modal openModal={openModal} setOpenModal={setOpenModal}>
      <div className="relative card shadow-xl mb-5 mx-2 group rounded-none">
        <Carousel
          showThumbs={false}
          autoPlay
          showArrows={false}
          showIndicators={false}
          showStatus={false}
          infiniteLoop
          interval={5000}
          stopOnHover
          emulateTouch
        >
          <img
            src={coffee}
            alt="coffee"
            className=" w-full md:w-[320px] aspect-video"
          />
          <img
            src={coffee}
            alt="coffee"
            className=" w-full md:w-[320px] aspect-video"
          />
          <img
            src={coffee}
            alt="coffee"
            className=" w-full md:w-[320px] aspect-video"
          />
        </Carousel>
        <div className="card-body flex flex-col justify-between items-center overflow-y-auto  custom-scrollbar p-5">
          <div>
            <h2 className="card-title text-white h-10 ">
              {selectedProduct?.name}
            </h2>
            <div className="flex flex-col gap-2 ">
              Description: {selectedProduct?.description}
            </div>
          </div>
          <div className="w-full flex flex-col gap-2">
            <div className="card-actions flex">
              <div className="text-green-600 text-lg">
                Price: ₹ {selectedProduct?.price}
              </div>
            </div>
            <button
              className="btn btn-primary w-full"
              // onClick={handelAddToCart}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProductInfoModal;
