import React, { useContext, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';

const ShippingAddressScreen = () => {
  const navigate= useNavigate();

  const{state,dispatch:ctxDispatch}= useContext(Store);

  const{
    cart:{shippingAddress},
  }=state;

  const [fullName, setFullName] = useState(shippingAddress.fullName|| '');
  const [address, setAddress] = useState(shippingAddress.address||'');
  const [city, setCity] = useState(shippingAddress.city||'');
  const [postal, setPostal] = useState(shippingAddress.postal||'');
  const [country, setCountry] = useState(shippingAddress.country||'');

  const submitHandler = (e) => {
    e.preventDefault();

    ctxDispatch({
      type:'SAVE_SHIPPING_ADDRESS',
      payload:{
        fullName,
        address,
        city,
        postal,
        country,
      },
    })
    localStorage.setItem(
      'shippingAddress',JSON.stringify({
        fullName,
        address,
        city,
        postal,
        country,
      })
    )

    navigate('/payment')
  };

  return (
    <div>
      <Helmet>
        <title> Shipping Address</title>
      </Helmet>
      <div className="container small-container">
        <h1 className="my-3">Shipping Address</h1>

        {/*  Creating Form & then grouping in different Section like FullName,Address,City etc. */}
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="fullName">
            <Form.Label> Full Name</Form.Label>
            <Form.Control
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="address">
            <Form.Label> Address</Form.Label>
            <Form.Control
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="country">
            <Form.Label> Country</Form.Label>
            <Form.Control
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </Form.Group>


          <Form.Group className="mb-3" controlId="city">
            <Form.Label> City</Form.Label>
            <Form.Control
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />

          <Form.Group className="mb-3" controlId="postal">
            <Form.Label> Postal Code</Form.Label>
            <Form.Control
              value={postal}
              onChange={(e) => setPostal(e.target.value)}
              required
            />
          </Form.Group>

         
          </Form.Group>

          <div className="mb-3">
            <Button variant="primary" type="submit">
              Continue Payment
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ShippingAddressScreen;
