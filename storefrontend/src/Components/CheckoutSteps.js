import React from 'react'
import { Col, Row } from 'react-bootstrap'

export default function CheckoutSteps(props) {
  return (
    <div>
      {/* Here Props are the parameter values being passed when we call This Chekout page for the us of Differnt segment like Signin,Shipping etc. */}
      {/* Also Step1,step2 are the variable being passed as an props to Checkout Function in Chekcout page & by default they are Deactivated & When passed ,that means they are active */}
      
      <Row className='checkout-steps'>
        <Col className={props.step1?'active':''}>Sign-In</Col>
        <Col className={props.step2?'active':''}>Shipping</Col>
        <Col className={props.step3?'active':''}>Payment</Col>
        <Col className={props.step4?'active':''}>Place Order</Col>
      </Row>
    </div>
  )
}
