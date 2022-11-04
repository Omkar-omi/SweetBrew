import { Link } from 'react-router-dom';
import { GiCoffeeCup } from "react-icons/gi";

const NotFound = () => {
  return (
    <div className="grid place-items-center h-screen text-primary">
      <div className='flex flex-col items-center'>
        <h2 className='text-7xl'>Error</h2>
        <div className='flex gap-2 my-2 '>
          <div className='text-9xl'>4</div>
          <div className='text-9xl'><GiCoffeeCup /></div>
          <div className='text-9xl'>4</div>
        </div>
        <p className='text-2xl'>Sorry that page cannot be found</p>
        <Link to="/" className='text-2xl'>Back to Home page</Link>
      </div>
    </div>

  );
}

export default NotFound;