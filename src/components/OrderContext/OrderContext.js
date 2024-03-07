import { createContext, useState, useReducer, useContext, useEffect } from 'react';
import { cache, cached } from 'utils';
import config from 'config';
const { ORDER_DEFAULTS } = config;

const OrderContext = createContext();

function orderReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_ORDER':
      // Assuming action.payload contains the entire new order object
      // return { ...state, ...action.payload };
      return action.payload;
    case 'RESET_ORDER':
      return ORDER_DEFAULTS;
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export const OrderProvider = ({ children }) => {
  const initialOrderState = cached('order') || ORDER_DEFAULTS;
  const [order, dispatch] = useReducer(orderReducer, initialOrderState);
  const [ clientSecret, setClientSecret ] = useState(null);

  useEffect(() => { cache('order', order) }, [order]);
  
  const setOrder = (orderData) => dispatch({ type: 'UPDATE_ORDER', payload: orderData });
  const resetOrder = () => {
    dispatch({ type: 'RESET_ORDER' });
    setClientSecret(null);
  }

  const value = { order, setOrder, resetOrder, clientSecret, setClientSecret };
  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrder = () => useContext(OrderContext);
