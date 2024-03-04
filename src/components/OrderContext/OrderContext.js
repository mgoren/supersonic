import { createContext, useReducer, useContext, useEffect } from 'react';
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
  const initialState = cached('order') || ORDER_DEFAULTS;
  const [state, dispatch] = useReducer(orderReducer, initialState);

  useEffect(() => { cache('order', state) }, [state]);
  
  const value = { state, dispatch };
  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrder must be used within an OrderProvider');
  const { state, dispatch } = context;

  // expose shortcuts for common operations
  const setOrder = (order) => dispatch({ type: 'UPDATE_ORDER', payload: order });
  const resetOrder = () => dispatch({ type: 'RESET_ORDER' });

  return { order: state, setOrder, resetOrder, dispatch };
}
