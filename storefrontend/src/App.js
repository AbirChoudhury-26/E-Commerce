// import data from "./data";
import {BrowserRouter,Route,Routes} from 'react-router-dom';
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import {LinkContainer} from 'react-router-bootstrap';
import Badge from 'react-bootstrap/esm/Badge';
import { Link } from 'react-router-dom';
import { Store } from './Store';
import { useContext } from 'react';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import SignupScreen from './screens/SignupScreen';
import { NavDropdown } from 'react-bootstrap';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceorderScreen from './screens/PlaceorderScreen';
import OrderedScreen from './screens/OrderedScreen';

function App() {
  
  const{state,dispatch:ctxDispatch}= useContext(Store); 
  const{cart,userInfo}=state;
  
  const logoutHandler=()=>{
   ctxDispatch({type:'USER_SIGNOUT'});
   localStorage.removeItem('userInfo');
   localStorage.removeItem('shippingAddress'); 
   localStorage.removeItem('paymentMethod');
  };


  return (
    <BrowserRouter>
    <div className='d-flex flex-column site-container'>   {/* Here we use Bootstrap class of flex in direction of column and to give our own css we named it as (site container)*/}
      {/* Bootstrap */}
      <ToastContainer position="bottom-center" limit={1}/>
      <header>                  
        <Navbar bg="dark" variant="dark">
          <Container>
            <LinkContainer to="/">
            <Navbar.Brand>The Goods Planet</Navbar.Brand>
            </LinkContainer>
            <Nav className="me-auto">
              <Link to="/cart" className="nav-Link space">
                Cart
                {cart.cartItems.length>0 && (
                  <Badge pill bg="danger">{cart.cartItems.reduce((a,c)=> a+c.quantity,0)}</Badge>
                )}
              </Link>
            
             {userInfo ?(
              <NavDropdown title={userInfo.name} id="basic-nav-dropdown" >
                <LinkContainer to="/profile">
                  <NavDropdown.Item> User Profile</NavDropdown.Item>
                </LinkContainer>

                <LinkContainer to="/orderhistory">
                  <NavDropdown.Item> Order History</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider/>
                <Link className='logout' to="/logout" onClick={logoutHandler}>
                  Logout
                </Link>
              </NavDropdown>

             ):(
              <Link className="nav-link" to="/signin" id="signin">Sign In</Link>
              )}
            </Nav>
          </Container>
        </Navbar>
        
      </header>
      <main>
        <Container className='mt-5'>
        <Routes>
          <Route path="/product/:type" element={<ProductScreen/>}/>
          <Route path="/cart" element={<CartScreen/>}/>
          <Route path='/signin' element={<SigninScreen/>}/>
          <Route path="/shipping" element={<ShippingAddressScreen/>}/>
          <Route path="/" element={<HomeScreen/>}/>
          <Route path='/signup' element={<SignupScreen/>}/>
          <Route path='/placeorder' element={<PlaceorderScreen/>}/>
          <Route path='/payment' element={<PaymentScreen/>}/>
           <Route path='/order/:id' element={<OrderedScreen/>}/>
        </Routes>
        </Container>
      </main>
 
      <footer>
        <div className='text-center'> All Right Reserved</div>
      </footer>
    </div>
    </BrowserRouter>
  );
}

export default App;
