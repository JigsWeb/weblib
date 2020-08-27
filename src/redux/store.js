import { configureStore } from '@reduxjs/toolkit'

import products from './modules/products';
import cart from './modules/cart';

export default configureStore({
  reducer: { products, cart }
})