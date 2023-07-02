import { useEffect, useReducer } from "react";

// import data from "../data";
import axios from 'axios';
// import logger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from "../Components/Product";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../Components/LoadingBox";
import MessageBox from "../Components/MessageBox";

const reducer =(state,action)=>{
  switch(action.type)
  {
    case 'FETCH_REQUEST':
       return {...state,loading:true};
    case 'FETCH_SUCCESS':
       return {...state,products:action.payload,loading:false};
    case 'FECTH_ FAIL':
       return{...state,loading:false,error:action.payload};
    default:
      return state;
  }
};

function HomeScreen(){

 const[{loading,error,products},dispatch]=useReducer((reducer),
 {products:[],
  loading:true,
  error:''});  // Second Paramter in useReducer is Default ,which we kept true for laoding ,like whenever we load it comes to true at begining

  useEffect(()=>{            // Uses two Parameter,First is an function that is to be called only once.Here we have an API function to get products from backend and Second is an Empty array.
    const fetchData= async()=>{
      dispatch({type:'FETCH_REQUEST'});
      try{
        const result =await axios.get('/api/products');   // Here we used an AJAX request to create an url products using AXIOS and save it to result variable.
      dispatch({type:'FETCH_SUCCESS',payload:result.data}); 
      }catch(err){
        dispatch({type:'FETCH_FAIL',payload:err.message});
      }
    
    };
    fetchData();
  },[]);
    return <div>
      <Helmet>
        <title>The Goods Planet</title>
      </Helmet>
        <h1> Featured Products</h1>
        <div className="products">
        {
          loading?(
          <LoadingBox>
          </LoadingBox>)
          :error?(<MessageBox variant="danger">{error}</MessageBox>):(
            <Row>
          {products.map((product)=>(   // Product  and not products becoz  we are taking each of the individual item
            <Col key={product.type} sm={6} md={4} lg={3} className="mb-3">
               {/*  Now we Define Components which are reusable peices of code in o ur React pages and added to parent page together ,which take props as parameter. */}
               {/* Here we create Product Componenets and inside it we define all the properties and details regarding products */}
              <Product product={product}></Product>          
            </Col>
          ))
          }
          </Row>
          )}
        </div> 

        </div>
}

export default HomeScreen;