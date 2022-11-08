import { AuthContextProvider } from '../context/AuthContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import NotFound from './NotFound';
import Login from './Login';
import Home from './Home';
import SignUp from './SignUp';
import Profile from './Profile';
import Checkout from './Checkout';
import YourOrders from './YourOrders';
import Favourite from './Favourite';
function App() {
  return (
    <AuthContextProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route exactly path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/checkout' element={<Checkout />} />
            <Route path='/favourite' element={<Favourite />} />
            <Route path='/yourorders' element={<YourOrders />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </div>
      </Router >
    </AuthContextProvider>
  );
}

export default App;
