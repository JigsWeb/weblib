import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';

import * as api from '../../api';

export const fetchCartItems = createAsyncThunk('cart/fetchCartItems', async () => api.cart.get())
export const upsertCartItems = createAsyncThunk('cart/upsertCartItems', async ({ productId, quantity }) => api.cart.upsert({ productId }, { quantity }));
export const removeCartItem = createAsyncThunk('cart/removeCartItem', async ({ productId }) => api.cart.remove({ productId }));
export const removeAllCartItems = createAsyncThunk('cart/removeAllCartItems', async () => api.cart.removeAll());

const cartAdapter = createEntityAdapter({ status: 'idle', optimisticPromises: [], selectId: cartItem => cartItem.productId });

export const slice = createSlice({
  name: 'cart',
  initialState: cartAdapter.getInitialState(),
  reducers: { },
  extraReducers: {
    [fetchCartItems.fulfilled]: (state, action) => cartAdapter.addMany(state, action.payload),
    [upsertCartItems.pending]: (state, action) => cartAdapter.upsertOne(state, action.meta.arg),
    [upsertCartItems.fulfilled]: (state, action) => action.payload && cartAdapter.upsertOne(state, action.payload),
    [removeCartItem.pending]: (state, action) => cartAdapter.removeOne(state, action.meta.arg.productId),
    [removeAllCartItems.pending]: (state, action) => {
      state.status = 'loading';
    },
    [removeAllCartItems.fulfilled]: (state, action) => {
      state.status = 'idle';
      cartAdapter.removeAll(state);
    },
  }
});

export const selectCartQuantityByProductId = (state, productId) => (Object.values(state.cart.entities).find(item => item.productId === productId) || { quantity: 0}).quantity;

export default slice.reducer;