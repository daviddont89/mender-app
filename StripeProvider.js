import React from 'react';
import { StripeProvider as RNStripeProvider } from '@stripe/stripe-react-native';

// TODO: Replace with your actual Stripe publishable key
const STRIPE_PUBLISHABLE_KEY = 'pk_live_OZ8yupizgYk7rGNRFObYJHz1';

export default function StripeProvider({ children }) {
  return (
    <RNStripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      {children}
    </RNStripeProvider>
  );
} 