import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found">
      <h2 className='error'>Error 404</h2>
      <p className='error-msg'>Sorry that page cannot be found</p>
      <Link to="/" className='error-msg'>Back to Home page</Link>
    </div>
  );
}

export default NotFound;