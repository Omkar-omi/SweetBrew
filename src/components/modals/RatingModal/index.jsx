import { FaStar } from "react-icons/fa";
import Modal from "../../../commons/Modal";
import { useEffect, useState } from "react";

const RatingModal = ({
  openModal,
  setOpenModal,
  review,
  setReview,
  setRating,
  handelReview,
  rating,
  selectedProduct,
}) => {
  const [hover, setHover] = useState(null);

  useEffect(() => {
    if (selectedProduct?.rating >= 0) {
      setRating(selectedProduct?.rating);
    }
    if (selectedProduct?.review?.length >= 0) {
      setReview(selectedProduct?.review);
    }
  }, [openModal]);

  return (
    <Modal openModal={openModal} setOpenModal={setOpenModal} longModal>
      <div className="m-4">
        <h3 className="font-bold text-lg">Rate your order:</h3>
        <div className="flex flex-col ">
          <div className="my-3">Write a Review:</div>
          <textarea
            maxLength={200}
            placeholder="(Optional)"
            className="p-2 rounded-lg text-white w-full h-24 resize-none"
            type="email"
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
          <div className="w-max ml-auto">{review.length} / 200</div>
        </div>
        <div className="flex justify-between items-center my-3">
          <div
            className="px-4 py-2 text-[#3b1D00] bg-primary uppercase font-semibold rounded-lg"
            onClick={handelReview}
          >
            Save
          </div>
          <div className="flex">
            {[...Array(5)].map((star, i) => {
              const ratingValue = i + 1;
              return (
                <label key={i}>
                  <input
                    type="radio"
                    name="rating"
                    className="hidden"
                    value={ratingValue}
                    onClick={() => setRating(ratingValue)}
                  />
                  <FaStar
                    className="star cursor-pointer"
                    size={30}
                    color={
                      ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"
                    }
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(null)}
                  />
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RatingModal;
