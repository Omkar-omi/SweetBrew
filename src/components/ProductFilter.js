import { BsSearch } from "react-icons/bs";

const ProductFilter = () => {
  return (
    <div className="flex flex-col lg:flex-row mx-3 mt-4 justify-between">
      <div className="flex flex-row form-control md:grow">
        <input type="text" placeholder="Search categoty or menu" className="input text-white input-bordered border-primary grow" />
        <button className="btn btn-primary mx-2"><BsSearch />&nbsp;Search</button>
      </div>
      <div className="tabs tabs-boxed lg:ml-5 lg:mt-0  mt-5">
        <div className="tab text-xl">All</div>
        <div className="tab text-xl">Coffee</div>
        <div className="tab text-xl">Deserts</div>
        <div className="tab text-xl">Snacks</div>
      </div>
    </div>
  );
}

export default ProductFilter;