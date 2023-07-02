
import axios from "axios";
import { useContext, useEffect, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Rating from "../Components/Rating";
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import ListGroupItem from "react-bootstrap/esm/ListGroupItem";
import Button from "react-bootstrap/esm/Button";
import {Helmet} from 'react-helmet-async';
import LoadingBox from "../Components/LoadingBox";
import MessageBox from "../Components/MessageBox";
import { getError } from "../util";
import { Store } from "../Store";
// import { Store } from "../Store";

const reducer =(state,action)=>{
      switch(action.type)
      {
        case 'FETCH_REQUEST':
           return {...state,loading:true};
        case 'FETCH_SUCCESS':
           return {...state,product:action.payload,loading:false};
        case 'FECTH_ FAIL':
           return{...state,loading:false,error:action.payload};
        default:
          return state;
      }
    };

function ProductScreen(){
       const navigate= useNavigate();
      const params=useParams();
      const{ type }=params;

      const[{loading,error,product},dispatch]=useReducer((reducer),
      {
      product:[],
       loading:true,
       error:''
      });  // Second Paramter in useReducer is Default ,which we kept true for laoding ,like whenever we load it comes to true at begining
     
       useEffect(()=>{            // Uses two Parameter,First is an function that is to be called only once.Here we have an API function to get products from backend and Second is an Empty array.
         const fetchData= async()=>{
           dispatch({type:'FETCH_REQUEST'});
           try{
             const result =await axios.get(`/api/products/type/${type}`);   // Here we used an AJAX request to create an url products using AXIOS and save it to result variable.
           dispatch({type:'FETCH_SUCCESS',payload:result.data}); 
           }catch(err){
             dispatch({type:'FETCH_FAIL',payload:getError(err)});
           }
         
         };
         fetchData();
       },[type]);
      
       const{state,dispatch:ctxDispatch}= useContext(Store);   // Access to state of Context & change its context
       const{cart}=state;
       const addToCartHandler=async()=>{
        const existItem=cart.cartItems.find((x)=>x._id===product._id);
        const quantity=existItem?existItem.quantity+1:1;

         const {data} =await axios.get(`/api/products/${product._id}`); // This is an Ajax request to check if the data demanded for Cart of an Product ,really exist in the databse

          if(data.countInStock<quantity)
          {
           window.alert("Sorry,Item Out of Stocks!!!☹");
           return;
          }
          ctxDispatch({type:'CART_ADD_ITEM',payload:{...product,quantity},
        });
        navigate('/cart');
       };

      return  loading?(
        <LoadingBox/>)
        :error?(<MessageBox variant="danger">{error}</MessageBox>):
            (
                  <div>
                        <Row>
                          {/* Below Section of half-screen for image */}
                              <Col md={6}>
                                <img src={product.image} alt={product.name} width="75%" height="75%"></img>
                              </Col>
                           {/*Below Section half of Seconf half is to give product details like price,name,rating  etc..  */}
                              <Col md={4}>
                                <ListGroup variant="flush">
                                  <ListGroup.Item>
                                    <Helmet>
                                    <title>{product.name}</title>
                                    </Helmet>
                                    <h2>{product.name}</h2>
                                  </ListGroup.Item>

                                  <ListGroup.Item>
                                     <Rating 
                                      rating={product.rating}
                                      numReviews={product.numReviews}
                                      ></Rating>
                                  </ListGroup.Item>

                                  <ListGroup.Item> 
                                      Price : ${product.price}
                                  </ListGroup.Item>

                                  <ListGroup.Item> 
                                     <p> <b> Description :</b></p>
                                     <p> {product.description}</p>
                                  </ListGroup.Item>
                                </ListGroup>
                              </Col>
                            {/* Last half of second half will conatin in stock number and availablity of it in store */}
                              <Col md={2}>
                                <Card>
                                  <Card.Body className="stock">
                                    <ListGroup variant="flush">
                                      <ListGroup.Item>
                                      <Row>
                                        <Col>Price : ${product.price}</Col>
                                      </Row>
                                      </ListGroup.Item>
                                      <ListGroup.Item>
                                      <Row>
                                        <Col>Status:</Col>
                                        <Col>
                                        {product.countInStock > 0 ? (
                                        <Badge bg= "success">In Stocks</Badge>
                                        ) 
                                        : (
                                        <Badge bg="danger"> Unavailable </Badge>
                                        )}
                                        </Col>
                                      </Row>
                                      </ListGroup.Item>
                                    </ListGroup>

                                    {/*  Add to cart button */}
                                       {product.countInStock >0 && (
                                        <ListGroupItem>
                                           <div className="d-gid">
                                            <Button onClick={addToCartHandler} className="bts" variant="success"> Add to Cart</Button>
                                           </div>
                                        </ListGroupItem>
                                       )}
                                    
                                  </Card.Body>
                                </Card>
                              </Col>

                        </Row>
                  </div>
            )
       
}

export default ProductScreen;