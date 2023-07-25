import React, { useContext, useEffect, useReducer } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import LoadingBox from '../Components/LoadingBox';
import MessageBox from '../Components/MessageBox';
import { Store } from '../Store';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getError } from '../util';
import axios from 'axios';
import { ListGroup } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { toast } from 'react-toastify';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false};
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false };
    default:
      return state;
  }
}

const OrderedScreen = () => {
  // UserReducer is just an Advanced version of UseState to update our State.
  //  It does this by updating the Initial States by dispatching the Action type & is Responsible for Triggerring the Reducer Function whcih has differnt action types.

  const { state } = useContext(Store);
  const { userInfo } = state;

  // useParams is essential for handling dynamic routing and extracting URL parameters in React applications
  const params = useParams();
  const { id: orderId } = params;

  const navigate = useNavigate();
  const [{ loading, error, order, successPay, loadingPay }, dispatch] =
    useReducer(reducer, {
      loading: true,
      order: {},
      error: '',
      successPay: false,
      loadingPay: false,
    });

  //   usePaypalScriptReducer() to manage the state of loading script & function to load the script.
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  //  First Function to get Trigerred when Paypal button is Clicked. It heps to create an Order amount in the Page so as to bepaid along with OrdreID Creation.
  //  This is yhen Passed to onApprove function().
  function createOrder(data, actions) {
    return actions.order
      .create({
        purchased_units: [
          {
            amount: { value: order.orderTotal },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  }

  //  The onApprove captures the Payment Details for the backend Storage. If Successsful along with userInfo ,then success else we get error.
  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        toast.success('Hurray🎊.Order is Paid');
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) });
        toast.error('Pay nahi hua');
      }
    });
  }

  function onError(err) {
    // toast.error('Hua hi nahi.......');
    console.error('PayPal Error:', err); // Log the actual error message to the console
  toast.error('An error occurred during payment. Please try again later.');
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (!userInfo) return navigate('/login');

    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'INR',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPaypalScript();
    }
  }, [orderId, userInfo, order, navigate, paypalDispatch, successPay]);

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title> Order :{orderId}</title>
      </Helmet>

      <h1 className="my-3"> Order {orderId}</h1>
      <Row>
        {/*  Row divided in  8-Col Section out of 12 according to Medium Screen Size */}
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title> Shipping</Card.Title>
              <Card.Text className="preview">
                <strong> Name:</strong>
                {order.shippingAddress.fullName}
                <br />
                <strong> Address:</strong> {order.shippingAddress.address},
                {order.shippingAddress.city},{order.shippingAddress.postalCode},
                {order.shippingAddress.country}
                <br />
              </Card.Text>

              {order.isDelievered ? (
                <MessageBox variant="success">
                  {' '}
                  Deleivered At {order.deleiveredAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger"> Not Deleivered</MessageBox>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title> Payment</Card.Title>
              <Card.Text className="preview">
                <strong> Method:</strong>
                {order.paymentMethod}
                <br />
              </Card.Text>
              {order.isPaid ? (
                <MessageBox variant="success">
                  {' '}
                  Paid At {order.paidAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger"> Not Paid</MessageBox>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title> Items</Card.Title>

              <ListGroup variant="flush">
                {order.orderItems &&
                  order.orderItems.map((item) => (
                    <ListGroup.Item key={item._id}>
                      <Row className="align-items-center">
                        <Col md={6}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="img-fluid rounded img-thumbnail"
                          ></img>{' '}
                          <Link to={`/product/${item.type}`}>{item.name}</Link>
                        </Col>

                        <Col md={3}>
                          <span> {item.quantity}</span>
                        </Col>
                        <Col md={3}>${item.price}</Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Next 4-Col are meant for Order Summary Card Box */}

        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title> Order Summary</Card.Title>

              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Items</strong>
                    </Col>
                    <Col> ${order.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Shipping</strong>
                    </Col>
                    <Col> ${order.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Tax</strong>
                    </Col>
                    <Col> ${order.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Order Total</strong>
                    </Col>
                    <Col>
                      {' '}
                      <b>${order.orderTotal.toFixed(2)}</b>
                    </Col>
                  </Row>
                </ListGroup.Item>

                {!order.isPaid && (
                  <ListGroup.Item>
                    {isPending ? (
                      <LoadingBox />
                    ) : (
                      //  There are 3 Props as an Handler function in our PayPalButtons extracted from React-paypal service.
                      // 1. createOrder works when we Click on Paypal Button.
                      // 2. onApprove works when we want to update the status of Successful Payment in backend.
                      //   3. onError works for handling any kind of Error Situation.
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    )}
                    {loadingPay && <LoadingBox />}
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderedScreen;
