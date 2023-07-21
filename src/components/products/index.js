import { lazy } from 'react';

const Products = lazy(() =>
  import('./products' /* webpackChunkName: "channels" */)
);

export default Products;
