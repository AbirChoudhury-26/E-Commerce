import React, { useContext, useEffect, useState } from 'react'
import CheckoutSteps from '../Components/CheckoutSteps'
import { Helmet } from 'react-helmet-async'
import Form  from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Store } from '../Store'
import { useNavigate } from 'react-router-dom'

const PaymentScreen = () => {
    
    const navigate=useNavigate();
    const{state,dispatch:ctxDispatch}=useContext(Store);
    const{
        cart:{shippingAddress, PaymentMethod},
    }=state;

    const[paymentMethodName,setPaymentMethod]=useState(PaymentMethod || 'Paytm')

    useEffect(()=>{
        if(!shippingAddress.address)
        {
            navigate('/shipping');
        }
    },[shippingAddress,navigate]);

    const submitHandler=(e)=>{
         e.preventDefault();
         ctxDispatch({type:'SAVE_PAYMENT_METHOD',payload:paymentMethodName});
         localStorage.setItem('paymentMethod',paymentMethodName);
         navigate('/placeorder');
    };


  return (
    <div>
      <CheckoutSteps step1 step2 step3/>
      <div className='container small-container'>
      <Helmet>
        <title> Payment Method</title>
      </Helmet>

      <h1 className='my-3'>Payment Method</h1>

      <Form onSubmit={submitHandler}>
      <div className="mb-3">
      <Form.Check 
       type="radio"
       id="Paytm"
       label="Paytm"
       value="Paytm"
       checked={paymentMethodName==='Paytm'}
        onChange={(e)=> setPaymentMethod(e.target.value)}
        />
     </div>

     <div className="mb-3">
      <Form.Check 
       type="radio"
       id="Google Pay"
       label="Google Pay"
       value="Google Pay"
       checked={paymentMethodName==='Google Pay'}
        onChange={(e)=> setPaymentMethod(e.target.value)}
        />
     </div>
     <div className="mb-3">
     <Button type="submit">Continue </Button>
     </div>
     
        
      </Form>
      </div>
    </div>
  )
}

export default PaymentScreen
