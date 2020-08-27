import { createSlice, createAsyncThunk, createEntityAdapter, nanoid } from '@reduxjs/toolkit';

import * as api from '../../api';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async ({ limit, offset }) => {
  const products = await api.product.list({ limit, offset });

  return products;
})

export const countProducts = createAsyncThunk('products/countProducts', async () => {
  const products = await api.product.count();

  return products;
})

const productsAdapter = createEntityAdapter({ total: 0, selectId: product => product.lazyId });

export const slice = createSlice({
  name: 'products',
  initialState: productsAdapter.getInitialState(),
  reducers: {},
  extraReducers: {
    [fetchProducts.pending]: (state, action) => {
      const lazyProducts = Array
        .from({ length: action.meta.arg.limit })
        .map(_ => ({ lazyId: nanoid(), isLazy: true, name: '' }));
      
      action.meta.arg.lazyIds = lazyProducts.map(product => product.lazyId);

      productsAdapter.addMany(state, lazyProducts);
    },
    [fetchProducts.fulfilled]: (state, action) => {
      productsAdapter.updateMany(state, action.payload.map((product, i) => ({ id: action.meta.arg.lazyIds[i], changes: { ...product, isLazy: false } })))
    },
    [countProducts.fulfilled]: (state, action) => {
      state.total = action.payload;
    }
  }
});

export const {
  selectAll: selectAllProducts,
  selectById: selectProductById,
  selectIds: selectProductIds
} = productsAdapter.getSelectors(state => state.products)

export const selectHasMoreProducts = state => state.products.ids.length < state.products.total;

export default slice.reducer;