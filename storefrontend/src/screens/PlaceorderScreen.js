import React, { useContext, useEffect, useReducer } from 'react';
import CheckoutSteps from '../Components/CheckoutSteps';
import { Helmet } from 'react-helmet-async';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../util';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import  Axios  from 'axios';
import LoadingBox from '../Components/LoadingBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, laoding: false };
    default:
      return state;
  }
};

const PlaceorderScreen = () => {
  const navigate = useNavigate();

  const [{ loading}, dispatch] = useReducer(reducer, {
    // It takes two params: Data part & second is Dispatch. In our case we have data part as Loader . So we create a Reducer function where we defined different types of cases so as to dispatch them when required
    loading: false,
    error: '',
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const round1 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; //123.234567=> 123.23 . 'Number.EPSILON' is a very small value, approximately 2.220446049250313e-16, which helps to prevent rounding errors.
  /// Consider that round1 is a Function which performs round calculation on  a Number
  //  Now for each of the calculation in List Group like: Items Price,Shipping Price,Tax etc., we will use this as a Function & pass the logic of these inside it as Params.

  cart.itemsPrice = round1(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  ); // Reduce is a method which is to be called in our CartItems array one by one. Here we Take 2 Params:First is 'a'- Acuumulator & c-'Current Value'.
  cart.shippingPrice = cart.itemsPrice > 500 ? round1(0) : round1(40);
  const SGST = 0.2;
  const CGST = 0.25;
  cart.taxPrice = round1(SGST * CGST * cart.itemsPrice);

  cart.orderTotal = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const placeorderHandler = async () => {
    try {
      dispatch({type:'CART_REQUEST'});
      // Now we are creating a final order in backend where all our details will be shown by Creting an Ajax Request 

      const {data}=await Axios.post(
        '/api/orders',
         {
            orderItems:cart.cartItems,
            shippingAddress:cart.shippingAddress,
            paymentMethod:cart.paymentMethod,
            itemsPrice:cart.itemsPrice,
            shippingPrice:cart.shippingPrice,
            taxPrice:cart.taxPrice,
            orderTotal:cart.orderTotal,
         },
         {
          headers:{
            authorization:`Bearer ${userInfo.token}`,// The value of userInfo.token is included after the word 'Bearer'. This allows the server to identify and authenticate the user making the request, using the provided token.
          },
         }
      );
    ctxDispatch({type:"CART_CLEAR"});
    ctxDispatch({type:"CREATE_SUCCESS"});
    localStorage.removeItem('cartItems');
    navigate(`/order/${data.order._id}`);

    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) navigate('/payment');
  }, [cart, navigate]);

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />
      <Helmet>
        <title>Preview Order</title>
      </Helmet>

      <h1 className="my-3">
        <b>Preview Order</b>
      </h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title> Shipping </Card.Title>
              <Card.Text className="preview">
                <strong> Name: </strong>
                {cart.shippingAddress.fullName}
                <br />
                <strong> Address: </strong>
                {cart.shippingAddress.address},{cart.shippingAddress.city},
                {cart.shippingAddress.postalCode},{cart.shippingAddress.country}
                <br />
              </Card.Text>
              <Link to="/shipping">Edit </Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title> Payment </Card.Title>
              <Card.Text className="preview">
                <strong> Method: </strong>
                {cart.paymentMethod}
              </Card.Text>
              <Link to="/payment">Edit </Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title> Items </Card.Title>
              <ListGroup variant="flush">
                {cart.cartItems.map((item) => (
                  <ListGroup.Item key={item.id}>
                    <Row className="alsign-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{' '}
                        <Link to={`/product/${item.type}`}>{item.name}</Link>
                      </Col>
                      <Col md={3} className="placeorderItems">
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3} className="placeorderItems">
                        ${item.price}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <Link to="/cart">Edit</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title> Order Summary</Card.Title>

              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col> Items</Col>
                    <Col> $ {cart.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col> $ {cart.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col> Tax</Col>
                    <Col> $ {cart.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <b> Order Total</b>
                    </Col>
                    <Col> $ {cart.orderTotal.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      onClick={placeorderHandler}
                      diabled={cart.cartItems.length === 0}
                    >
                      Place Order
                    </Button>
                  </div>
                  {loading && <LoadingBox/>}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PlaceorderScreen;
