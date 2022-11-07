import { FaStar } from "react-icons/fa";
import { AiOutlineStar } from "react-icons/ai";

const Star = ({ stars }) => {
  const ratingStar = Array.from({ length: 5 }, (e, index) => {
    return (
      <span key={index}>
        {stars >= index + 1 ? (<FaStar className="text-orange-400 md:text-2xl" />) : <AiOutlineStar className="md:text-2xl" />}
      </span>
    )
  })
  return <>{ratingStar}</>
}

export default Star;