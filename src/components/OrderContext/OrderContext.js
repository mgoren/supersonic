import 'firebase.js'; // initializes firebase
import { createContext, useState, useReducer, useContext, useEffect } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { renderToStaticMarkup } from 'react-dom/server';
import Receipt, { AdditionalPersonReceipt } from 'components/Receipt';
import { cache, cached } from 'utils';
import config from 'config';
const { ORDER_DEFAULTS, PAYMENT_METHODS, EMAIL_CONTACT } = config;
const functions = getFunctions();
const savePendingOrder = httpsCallable(functions, 'savePendingOrder');
const saveFinalOrder = httpsCallable(functions, 'saveFinalOrder');
const sendEmailConfirmations = httpsCallable(functions, 'sendEmailConfirmations');

const OrderContext = createContext();

function orderReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_ORDER':
      return { ...state, ...action.payload };
    case 'RESET_ORDER':
      return ORDER_DEFAULTS;
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export const OrderProvider = ({ children }) => {
  const initialOrderState = cached('order') || ORDER_DEFAULTS;
  const [order, dispatch] = useReducer(orderReducer, initialOrderState);
  const [clientSecret, setClientSecret] = useState(null);
  const [currentPage, setCurrentPage] = useState(cached('currentPage') || 1);
  const [processing, setProcessing] = useState(null);
  const [processingMessage, setProcessingMessage] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [error, setError] = useState(null);
  const [lastUpdatedTotal, setLastUpdatedTotal] = useState(null);

  useEffect(() => { cache('order', order) }, [order]);
  useEffect(() => { cache('currentPage', currentPage) }, [currentPage]);

  // wait for order to be updated before moving on to checkout page
  useEffect(() => {
    if (order.status === 'checkout') setCurrentPage('checkout');
  }, [order.status]);

  const updateOrder = (updates) => dispatch({ type: 'UPDATE_ORDER', payload: updates });

  const startOver = () => {
    dispatch({ type: 'RESET_ORDER' });
    setClientSecret(null);
    setCurrentPage(1);
  }

  const value = {
    startOver,
    order, updateOrder,
    clientSecret, setClientSecret,
    currentPage, setCurrentPage,
    processing, setProcessing,
    processingMessage, setProcessingMessage,
    error, setError,
    paymentMethod, setPaymentMethod,
    lastUpdatedTotal, setLastUpdatedTotal
  };
  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrder = () => useContext(OrderContext);

export const useOrderOperations = () => {
  const { order, updateOrder, paymentMethod, setError, setProcessingMessage } = useOrder();

  const prepOrderForFirebase = () => {
    const updates = {
      people: order.people.map(updateApartment),
      paymentMethod,
      paymentId: 'PENDING',
      idempotencyKey: order.idempotencyKey || crypto.randomUUID(),
      status: 'pendingInitialSave'
    };
    updateOrder(updates);
    return { ...order, ...updates };
  };

  const savePendingOrderToFirebase = (order) => {
    setProcessingMessage('Saving registration...');
    savePendingOrder(order); // fire-and-forget; save bkup in case user closes browser halfway thru payment processing
  };

  const saveFinalOrderToFirebase = async (order) => {
    setProcessingMessage(order.paymentId === 'check' ? 'Updating registration...' : 'Payment successful. Updating registration...');
    try {
      await saveFinalOrder(order);
      return true
    } catch (err) {
      console.error(`error updating firebase record`, err);
      setError(`Your payment was processed successfully. However, we encountered an error updating your registration. Please contact ${EMAIL_CONTACT}.`);
      return false;
    }
  };

  const sendReceipts = (order) => {
    setProcessingMessage('Sending email confirmation...');
    const emailReceiptPairs = generateReceipts({ order, paymentMethod });
    sendEmailConfirmations(emailReceiptPairs); // fire-and-forget
  };

  return { prepOrderForFirebase, savePendingOrderToFirebase, saveFinalOrderToFirebase, sendReceipts };
};

function updateApartment(person) {
  return (person.apartment && /^\d/.test(person.apartment)) ? { ...person, apartment: `#${person.apartment}` } : person;
}

function generateReceipts({ order, paymentMethod }) {
  const purchaserReceipt = renderToStaticMarkup(<Receipt order={order} currentPage='confirmation' checkPayment={paymentMethod === 'check'} />);
  const additionalPersonReceipt = renderToStaticMarkup(<AdditionalPersonReceipt order={order} checkPayment={paymentMethod === 'check'} />);
  const emailReceiptPairs = [{ email: order.people[0].email, receipt: purchaserReceipt }];
  order.people.slice(1).forEach(person => emailReceiptPairs.push({ email: person.email, receipt: additionalPersonReceipt }));
  return emailReceiptPairs;
}
