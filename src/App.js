import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectAllProducts, fetchProducts, selectHasMoreProducts } from './redux/modules/products'
import { selectCartQuantityByProductId, upsertCartItems, removeCartItem, removeAllCartItems } from './redux/modules/cart'

import './App.scss';
import { product } from './api';

function Header() {
  return (
    <header>
      <h2>MyShop</h2>
    </header>
  )
}

function Banner() {
  return <img alt="banner" src={process.env.PUBLIC_URL + '/banner.jpg'} width="100%" />;
}

function ProductListItem({ product }) {
  const dispatch = useDispatch();
  const ref = useRef(null);
  const quantity = useSelector(state => selectCartQuantityByProductId(state, product.id));

  useEffect(() => {
    if (ref.current) {
      ref.current.style.left = 0;
      ref.current.scrollLeft = 65;
      ref.current.style.scrollBehavior = 'smooth'
    }
  }, [])

  useEffect(() => {
    if (!quantity){
      ref.current.scrollLeft = 65;
      ref.current.style.overflowX = 'hidden';
    } else
      ref.current.style.overflowX = 'scroll';
  }, [quantity])

  const handleItemClick = () => !product.isLazy && dispatch(upsertCartItems({ productId: product.id, quantity: quantity + 1 }))
  
  const handleTrashClick = (ev) => {
    ev.stopPropagation();
    if (quantity) {
      dispatch(removeCartItem({ productId: product.id }));
      ref.current.scrollLeft = 65;
    }
  }

  const handleItemScroll = (ev) => {
    if (!quantity) {
      ev.preventDefault();
    }
  }

  return (
    <li className={product.isLazy ? 'lazy' : ''} ref={ref} onClick={handleItemClick} onScroll={handleItemScroll}>
      <div>
        <button className={quantity ? '' : 'disabled'}>
          <i className="fa fa-trash" onClick={handleTrashClick} />
        </button>
        <div className="informations">
          <p className="title">{product.isLazy ? 'Product#n' : product.name}</p>
          <p className="description">{product.isLazy ? 'Lorem ipsum papum, ipsum papum, ipsum papum' : product.description}</p>
        </div>
        <div className="quantity">
          x {quantity}
        </div>
      </div>
    </li>
  )
}

function ProductList() {
  const containerRef = useRef(null);
  const [{ limit, offset}, setQuery] = useState({ limit: 10, offset: 0 });

  const dispatch = useDispatch();
  
  const products = useSelector(selectAllProducts);
  const hasMoreProducts = useSelector(selectHasMoreProducts);
  
  useEffect(() => {
    if (hasMoreProducts)
      dispatch(fetchProducts({ limit, offset }))
  }, [limit, offset, dispatch, hasMoreProducts])

  useEffect(() => {
    const hasScrollBar = containerRef.current.scrollHeight > containerRef.current.clientHeight;
    
    if (products.length && hasMoreProducts && !hasScrollBar)
      setQuery({ limit, offset: offset + limit })
  }, [products, hasMoreProducts])

  const handleScroll = () => {
    const maxScroll = containerRef.current.scrollHeight - containerRef.current.clientHeight;
    const currentScroll = containerRef.current.scrollTop;
    const percentage = currentScroll*100/maxScroll;

    if (percentage > 75 && hasMoreProducts)
      setQuery({ limit, offset: offset + limit })
  }

  return (
    <ul ref={containerRef} onScroll={hasMoreProducts && handleScroll}>
      {products.map(product => <ProductListItem key={product.lazyId} product={product} />)}
    </ul>
  )
}

function Spinner() {
  return <div class="spinner"><div></div></div>
}

function Footer() {
  const dispatch = useDispatch();
  const hasCartItems = useSelector(state => !!state.cart.ids.length);
  const isLoading = useSelector(state => state.cart.status === 'loading');

  const handleButtonClick = () => {
    dispatch(removeAllCartItems()).then(() => alert('Commande passé avec succès.'))
  }

  return (
    <footer className={hasCartItems ? 'visible' : 'hidden'}>
      <button onClick={!isLoading && handleButtonClick}>{isLoading ? <Spinner /> : 'Passer commande'}</button>
    </footer>
  )
}

function App() {
  return (
    <>
      <Header />
      <Banner />
      <ProductList />
      <Footer />
    </>
  );
}

export default App;
