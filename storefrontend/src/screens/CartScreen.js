import { useContext, useEffect } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import MessageBox from '../Components/MessageBox';
import { Store } from '../Store';
import {Card, ListGroup} from 'react-bootstrap';
import {Button} from 'react-bootstrap';
import axios from 'axios';

export default function CartScreen() {
    
    const navigate= useNavigate();
  const { state, dispatch: ctxdispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

const updateCartHandler=async (item,quantity)=>{
    const {data} =await axios.get(`/api/products/${item._id}`); // This is an Ajax request to check if the data demanded for Cart of an Product ,really exist in the databse

          if(data.countInStock<quantity)
          {
           window.alert("Sorry,Item Out of Stocks!!!☹");
           return;
          }
        //   The payload carries information that is necessary to update the state in the reducer. It can contain any data relevant to the action, such as user input, API responses, or computed values. When an action is dispatched, the reducer receives the action along with its payload and determines how the state should be updated based on that payload.
          ctxdispatch({type:'CART_ADD_ITEM',payload:{...item,quantity},
        });

};

const removeHandler=(item)=>{
  ctxdispatch({type:'CART_REMOVE_ITEM',payload:item});
};

const checkoutHandler=()=>{
  navigate('/signin?redirect=/shipping');
}

  return (
    <div>
        <Helmet>
            <title>Shopping Cart</title>
        </Helmet>
        <h1>Shopping Cart</h1>
        <Row>
            <Col md={8}>
                 {cartItems.length===0?(
                    <MessageBox>
                        Cart is Empty!!!.<Link to="/">Go Shopping</Link>
                    </MessageBox>
                 ):
            (
                <ListGroup>
                     {cartItems.map((item)=>(
                           <ListGroup.Item key={item._id}>
                            <Row className="align-items-center">
                                <Col md={4}>
                                    <img 
                                    src={item.image}
                                    alt={item.name}
                                    className="img-fluid rounded img-thumbnail">

                                    </img>{' '}
                                    <Link to={`/product/${item.type}`}>{item.name}</Link>
                                </Col>
                                <Col md={3}>
                                    {/*  First Button represents - Sign to decrese the item count of any product added in Cart */}
                                    <Button  disabled={item.quantity===1}  onClick={()=> updateCartHandler(item,item.quantity-1)} className='icon'> 
                                      {/*  Disabled used so that Button cant be used when item count reached 1  */}
                                      <i className="fas fa-minus-circle"></i>
                                      {/* <i className="fa-solid fa-circle-minus"></i> */}
                                    </Button> {' '}
                                    
                                   {/* Middle Span denotes the product count of the item being displayed in Cart */}
                                   {' '}<span>{item.quantity}</span>{' '}
 
                                   {/* Third Button on right of Count is + Signt o Increment Item count of a product in Cart */}

                                   <Button variant="light" disabled={item.quantity===item.countInStock} onClick={()=> updateCartHandler(item,item.quantity+1)} className='icon'>

                           {/*  Disabled used so that Button cant be used when item count reached beyon items in Stock  */}
                                        
                                        <i className="fas fa-plus-circle"></i>
                                    </Button>

                                </Col>

                                <Col md={3}><b>${item.price}</b></Col>
                                <Col md={2}>
                                    <Button variant='light' onClick={()=>removeHandler(item)} className='icon'> 
                                        <i className="fas fa-trash"></i>
                                    </Button>
                                </Col>
                            </Row>
                           </ListGroup.Item>
                     ))}
                </ListGroup>
            )
                }
            </Col>
            <Col md={4}>
                <Card>
                    <Card.Body>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                               <h3>
                                 Subtotal ({cartItems.reduce((a,c)=> a +c.quantity,0)}{' '} items): $<b>{cartItems.reduce((a,c)=> a+ c.quantity*c.price,0)}</b> + == + INR<b>{cartItems.reduce((a,c)=> a+ c.quantity*c.price,0)*85}</b>
                               </h3>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <div className="d-gid">
                                    <Button type="button" variant="primary" disabled={cartItems.length===0}  onClick={checkoutHandler}>
                                        Proceed to Checkout
                                    </Button>
                                </div>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </div>
  )
}
