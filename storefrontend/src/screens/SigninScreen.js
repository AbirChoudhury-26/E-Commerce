import React, { useContext, useEffect, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link,useLocation, useNavigate } from 'react-router-dom';
import Axios from 'axios'
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../util';


const SigninScreen = () => {

   const navigate=useNavigate();
//  The whole process in next 3 lines indicate the working Procedure of getting a valid Shipping URL ,so as to create a new User Account

    // UseLocation: The useLocation Hook allows you to access the location object that represents the active URL. The value of the location object changes whenever the user navigates to a new URL.
    const {search} =useLocation();
    const redirectUrl= new URLSearchParams(search).get('redirect');
    // We get search value using Use Location hook & then putting this value to redirect to variable in form of Query String .
    const redirect =redirectUrl?redirectUrl:"/";


     const [email,setEmail]=useState('');
     const [password,setPassword]=useState('');

      const{state, dispatch: ctxDispatch}=useContext(Store)
      const userInfo=state;

     const submitHandler=async(e)=>{
      //  prevent default prevnet the Page to refersh again & again.
      e.preventDefault();
       try{
         const {data}=await Axios.post('api/users/signin',{
          email,
          password
         });
         ctxDispatch({type:'USER_SIGNIN',payload:data})
         localStorage.setItem('userInfo',JSON.stringify(data));
         navigate(redirect || '/')
        //  console.log(data);
       }
       catch(err)
       {
        // alert('Invalid Email or Password')
        // toast.error('Invalid Email or Password') This is an static message we have given, we will display message from Backend
           toast.error(getError(err));
       }
     };

    //  useEffect(() => {
    //   if (userInfo) {
    //     // console.log("Hello World");
    //     navigate(redirect);
    //   }
    // }, [navigate, redirect, userInfo]);

    useEffect(() => {
      if (!userInfo) {
        navigate(redirect);
      }
    }, [navigate, redirect,userInfo]);
    
    
  return (
    <Container classname="small">
      <Helmet>
        <title>SignIn</title>
      </Helmet>
      <h1 className="my-3">SignIn</h1>
      {/*  Form Box will be created & Form Group top ut Label with the Input box created & controlId as Identity of what Input box field is of Type */}
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>E-Mail</Form.Label>
          <Form.Control type="email" required onChange={(e)=>setEmail(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" required  onChange={(e)=>setPassword(e.target.value)}/>
        </Form.Group>

        <div className="mb-3">
            <Button type="submit"> Sign In</Button>
        </div>
        <div className="mb-3">
            New Customer?{' '}
            {/*  Here Redirects takes the shipping address value from url,to perform it,we write some code line above return  */}
            <Link to={`/signup?redirect=${redirect}`}> Create Account</Link>
        </div>
      </Form>
    </Container>
  );
};

export default SigninScreen;

