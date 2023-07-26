import {
  TabHeader,
  TabularModalPage,
} from '@commercetools-frontend/application-components';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import SpacingsInline from '@commercetools-uikit/spacings-inline';
import Spacings from '@commercetools-uikit/spacings';
import React from 'react';
import { Route, Switch, useParams, useRouteMatch } from 'react-router';
import { useProductDetails } from '../../hooks/use-products-connector';
import Text from '@commercetools-uikit/text';
import ProductDetialsForm from './productDetialsForm';
import SelectInput from '@commercetools-uikit/select-input';
import ProductVariant from './productVariant';
import Stamp from '@commercetools-uikit/stamp';
import { useFormik } from 'formik';

const ProductDetails = (props) => {
  const { id } = useParams();
  const match = useRouteMatch();

  const { product, error, loading } = useProductDetails({ id });

  const formik = useFormik({
    initialValues: {
      name: product?.masterData?.current?.name,
      key: product?.key,
    },
    enableReinitialize: true,
  });
  console.log(product);

  return (
    <>
      {loading && <LoadingSpinner />}
      {product ? (
        <TabularModalPage
          title={product.masterData.current.name}
          isOpen
          onClose={props.onClose}
          formControls={
            <SpacingsInline alignItems="center">
              <Text.Body>Status: </Text.Body>
              <SelectInput
                name="form-field-name"
                value={product.masterData.published}
                onChange={(e) => console.log(e)}
                options={[
                  {
                    value: true,
                    label: <Stamp tone="positive" label="Published"></Stamp>,
                  },
                  {
                    value: false,
                    label: <Stamp tone="critical" label="Unpublished"></Stamp>,
                  },
                ]}
              />
            </SpacingsInline>
          }
          tabControls={
            <>
              <TabHeader to={`${match.url}`} exactPathMatch label="General" />
              <TabHeader to={`${match.url}/variant`} label="Variants" />
              <TabHeader to={`${match.url}/search`} label="Int./Ext. Search" />
              <TabHeader
                to={`${match.url}/product-selection`}
                label="Product Selection"
              />
            </>
          }
        >
          <br />
          <div>
            <Spacings.Stack scale="m">
              <Switch>
                <Route path={`${match.url}`} exact>
                  <ProductDetialsForm data={formik} />
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
        </TabularModalPage>
      ) : (
        <></>
      )}
    </>
  );
};

export default ProductDetails;
