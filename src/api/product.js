import { nanoid } from '@reduxjs/toolkit';

const products = Array.from({ length: 70 }).map((_, i) => ({ id: nanoid(), name: `Product#${i + 1}`, description: 'Lorem ipsum papum, ipsum papum, ipsum papum' }))

const list = ({ limit = 10, offset = 0 } = {}) => new Promise(resolve => setTimeout(() => resolve(products.slice(offset, offset + limit)), 3000))

const count = () => new Promise(resolve => setTimeout(() => resolve(products.length), 1500));

export default {
  list, count
}