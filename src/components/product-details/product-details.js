import {
  PageContentWide,
  TabHeader,
  TabularModalPage,
} from '@commercetools-frontend/application-components';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import SpacingsInline from '@commercetools-uikit/spacings-inline';
import Spacings from '@commercetools-uikit/spacings';
import React, { useCallback } from 'react';
import { Route, Switch, useParams, useRouteMatch } from 'react-router';
import { useProductDetails } from '../../hooks/use-products-connector';
import Text from '@commercetools-uikit/text';
import ProductDetialsForm from './productDetialsForm';
import SelectInput from '@commercetools-uikit/select-input';
import ProductVariant from './productVariant';
import Stamp from '@commercetools-uikit/stamp';
import { useFormik } from 'formik';
import { docToFormValues, formValuesToDoc } from './conversion';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import {
  DOMAINS,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';
import {
  useLocalLang,
  useProductUpdater,
} from '../../hooks/use-products-connector/use-products-connector';

const ProductDetails = (props) => {
  const { id } = useParams();
  const showNotification = useShowNotification();
  const match = useRouteMatch();

  const { product, error, loading, updateProductStatus, refetch } =
    useProductDetails({
      id,
    });

  const { execute } = useProductUpdater();
  const { dataLocale, projectLanguages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
    projectLanguages: context.project?.languages ?? [],
  }));
  const handleSubmit = useCallback(
    async (formikValues) => {
      console.log(formikValues);
      const data = formValuesToDoc(formikValues);
      try {
        const newdata = await execute({
          originalDraft: product,
          nextDraft: data,
        });
        showNotification({
          domain: DOMAINS.SIDE,
          kind: NOTIFICATION_KINDS_SIDE.success,
          text: 'Product Updated successfully',
        });
      } catch (err) {
        console.log(err);
      }
    },
    [product, dataLocale, projectLanguages]
  );

  const formik = useFormik({
    initialValues: docToFormValues(product, projectLanguages),
    dataLocale: dataLocale,
    enableReinitialize: true,
    onSubmit: handleSubmit,
  });

  const { getLocalName } = useLocalLang();

  console.log(product);
  return (
    <>
      {loading && <LoadingSpinner />}
      {product ? (
        <TabularModalPage
          title={getLocalName({
            allLocales: product.masterData.staged.nameAllLocales,
            key: 'name',
          })}
          isOpen
          onClose={props.onClose}
          formControls={
            <SpacingsInline alignItems="center">
              <Text.Body>Status: </Text.Body>
              <SelectInput
                name="form-field-name"
                placeholder={
                  product.masterData.published &&
                  product.masterData.hasStagedChanges ? (
                    <Stamp tone="warning" label="Modified"></Stamp>
                  ) : product.masterData.published &&
                    !product.masterData.hasStagedChanges ? (
                    <Stamp tone="primary" label="Published"></Stamp>
                  ) : !product.masterData.published ? (
                    <Stamp tone="critical" label="Unpublished"></Stamp>
                  ) : (
                    <></>
                  )
                }
                onChange={async (e) => {
                  if (e.target.value === true) {
                    try {
                      await updateProductStatus({
                        variables: {
                          id: product.id,
                          version: product.version,
                          actions: [{ publish: { scope: 'All' } }],
                        },
                        context: {
                          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
                        },
                      });
                      showNotification({
                        domain: DOMAINS.SIDE,
                        kind: NOTIFICATION_KINDS_SIDE.success,
                        text: 'Product Updated successfully',
                      });
                    } catch (err) {
                      console.log(err);
                    }
                  } else if (e.target.value === false) {
                    try {
                      await updateProductStatus({
                        variables: {
                          id: product.id,
                          version: product.version,
                          actions: [{ unpublish: {} }],
                        },
                        context: {
                          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
                        },
                      });
                      showNotification({
                        domain: DOMAINS.SIDE,
                        kind: NOTIFICATION_KINDS_SIDE.success,
                        text: 'Product Updated successfully',
                      });
                    } catch (err) {
                      console.log(err);
                    }
                  }
                }}
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
              <TabHeader
                to={`${match.url}/variant`}
                label="Variants"
                exactPathMatch
              />
              <TabHeader
                to={`${match.url}/search`}
                label="Int./Ext. Search"
                exactPathMatch
              />
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
                  <PageContentWide columns="2/1">
                    <form onSubmit={formik.handleSubmit}>
                      <ProductDetialsForm data={formik} />
                    </form>
                    <Spacings.Stack>
                      <Text.Body tone="secondary">
                        Date Created: {product?.createdAt}
                      </Text.Body>

                      <Text.Body tone="secondary">
                        Date Modified: {product?.lastModifiedAt}
                      </Text.Body>
                    </Spacings.Stack>
                  </PageContentWide>
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
