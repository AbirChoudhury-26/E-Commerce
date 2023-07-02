import { createContext, useReducer } from 'react';
export const Store = createContext();

const initialState = {

  userInfo: localStorage.getItem('userInfo')
  ?JSON.parse(localStorage.getItem('userInfo')):null,
  
  cart: {

    shippingAddress: localStorage.getItem('shippingAddress')
    ? JSON.parse(localStorage.getItem('shippingAddress')):{},

    cartItems: localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems')):[],
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM':
      // Updated Style of adding itmes in cart for the particular products only.If new items exist then we add it to previous cart items 
      const newItem=action.payload;
      const existItem =state.cart.cartItems.find((item)=>item._id===newItem._id);
       const cartItems=existItem?
       state.cart.cartItems.map((item)=>item._id===existItem._id?newItem:item):
        [...state.cart.cartItems,newItem];
       
        // We want that our cart items shoulbe saved rather than being refreshed .So we  use Local storeage to save items
        //   It takes two parameter-Key value format,
         localStorage.setItem('cartItems',JSON.stringify(cartItems));
        return {...state,cart:{...state.cart,cartItems}};

        // Previous/Older style of adding itmes in cart
        
      // add to cart
      // return {
      //   ...state,
      //   cart: {
      //     ...state.cart,
      //     cartItems: [...state.cart.cartItems, action.payload],
      //   },
     // }; // ...stateCart is to keep the state same with addition of items in Cart & hence we increment cartitem using action.payload & keeping state of cart for cartItems

     case 'CART_REMOVE_ITEM':{
     const cartItems=state.cart.cartItems.filter((item)=>item._id!==action.payload._id);

     
      
      return {...state,cart:{...state.cart,cartItems}};
      // ... is called a Spread Operator
     }
      case 'USER_SIGNIN':
         return {...state,userInfo:action.payload};

      case 'USER_SIGNOUT':
          return {...state,userInfo:null};
      case 'SAVE_SHIPPING_ADDRESS':
            return{
              ...state,
              cart:{
                ...state.cart, shippingAddress:action.payload,
              },
            };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState); // There are 2 state of it: Reducer Function & Initial State
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
