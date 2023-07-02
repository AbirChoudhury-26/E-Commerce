import Card from 'react-bootstrap/Card';
// import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";
import Rating from './Rating';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../Store';
import { Button } from 'react-bootstrap';

function Product(props){ 
     const{product}=props;
     
     const { state, dispatch: ctxdispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } =state;

     const addToCartHandler=async (item)=>{

      const existItem=cartItems.find((x)=>x._id===product._id);
        const quantity=existItem?existItem.quantity+1:1;

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
  
      return (
        <Card className="cards" >
        <Link to={`/product/${product.type}`}>
       <img src={product.image} alt={product.name}  className="card-img-top"/>
       </Link>
       {/* <div className="product-info"> */}
       <Card.Body>
       <Link to={`/product/${product.type}`}>
          <Card.Title>{product.name}</Card.Title>
       </Link>
       {/* Similarly we define Rating Component to create details about Customer Reviews */}
       <Rating rating={product.rating} numReviews={product.numReviews}/>
       <div className='price'>
        ${product.price}
        </div>

        {/* <Link to={`/product/${product.type}`} className="home">
        <button class='btn'>More Info</button>
        </Link> */
        }


        {product.countInStock===0 ?<Button  variant ='light' disabled>Out of STOCK</Button>:
        <Button onClick={()=>addToCartHandler(product)}>Add to Cart</Button>
        }
        
       </Card.Body>

       {/* <p><b>Price: </b><strong>${product.price}</strong></p>
        <button className="b1"><center>Add to Cart</center> </button> */}
     
       {/* </div> */}
     </Card>  
      );
}
export default Product; 