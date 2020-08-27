import { product } from ".";
import { nanoid } from '@reduxjs/toolkit';

let cart = [];

const get = () => new Promise(resolve => setTimeout(() => resolve(cart), 1500))

const upsert = ({ productId }, { quantity }) => new Promise(resolve => {
  const isExist = cart.some(item => item.productId === productId);

  if (isExist)
    cart = cart.map(item => item.productId === productId ? ({ ...item, quantity }) : item);
  else
    cart = [...cart, { id: nanoid(), productId, quantity }];

  setTimeout(() => resolve(cart.find(item => item.productId === productId)), 1500)
})

const remove = ({ productId }) => new Promise(resolve => {
  const cartItem = { ...cart.find(item => item.productId === productId) };

  cart = cart.filter(item => item.productId !== productId);

  setTimeout(() => resolve(cartItem), 1500)
})

const removeAll = () => new Promise(resolve => {
  cart = [];

  setTimeout(() => resolve(cart), 1500);
})

export default {
  get, upsert, remove, removeAll
}