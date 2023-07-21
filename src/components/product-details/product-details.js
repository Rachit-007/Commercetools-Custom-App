import {
  FormModalPage,
  TabHeader,
} from '@commercetools-frontend/application-components';
import { SuspendedRoute } from '@commercetools-frontend/application-shell';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import Spacings from '@commercetools-uikit/spacings';
import React from 'react';
import { Route, Switch, useParams, useRouteMatch } from 'react-router';
import { useProductDetails } from '../../hooks/use-products-connector';
import ProductDetialsForm from './productDetialsForm';
import ProductVariant from './productVariant';

const ProductDetails = (props) => {
  const { id } = useParams();
  const match = useRouteMatch();

  const { product, error, loading, handleSubmit, register, setValue } =
    useProductDetails({ id });

  return (
    <>
      {loading && <LoadingSpinner />}
      {product ? (
        <FormModalPage
          title={product.masterData.current.name}
          isOpen
          onClose={props.onClose}
        >
          <TabHeader to={`${match.url}`} exactPathMatch label="General" />
          <TabHeader to={`${match.url}/variant`} label="Variants" />
          <TabHeader to={`${match.url}/search`} label="Int./Ext. Search" />
          <TabHeader
            to={`${match.url}/product-selection`}
            label="Product Selection"
          />
          <br />
          <div style={{ marginTop: '30px' }}>
            <Spacings.Stack scale="m">
              <Switch>
                <Route path={`${match.url}`} exact>
                  <ProductDetialsForm product={product} />
                </Route>
                <Route path={`${match.url}/variant`} exact>
                  <ProductVariant />
                </Route>
                <Route path={`${match.url}/search`} exact>
                  <div>Serach</div>
                </Route>
                <Route path={`${match.url}/product-selection`} exact>
                  <div>Product Selection</div>
                </Route>
              </Switch>
            </Spacings.Stack>
          </div>
        </FormModalPage>
      ) : (
        <></>
      )}
    </>
  );
};

export default ProductDetails;
