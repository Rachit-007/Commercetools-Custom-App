import {
  useMcMutation,
  useMcQuery,
} from '@commercetools-frontend/application-shell';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import FetchProductQuery from './fetch-products-ctp.graphql';
import ChangeProductStatus from './change-product-status.ctp.graphql';
import {
  DOMAINS,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';
import FetchProductDetailsQuery from './fetch-product-details.ctp.graphql';
import { useForm } from 'react-hook-form';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import { useEffect, useState } from 'react';

export const useProducts = ({ page, perPage, tableSorting }) => {
  const [check, setCheck] = useState([]);
  const [updateProductStatus, { data: updatedData }] =
    useMcMutation(ChangeProductStatus);
  const showNotification = useShowNotification();

  const { data, loading, error, refetch } = useMcQuery(FetchProductQuery, {
    variables: {
      limit: perPage.value,
      offset: (page.value - 1) * perPage.value,
      sort: [`${tableSorting.value.key} ${tableSorting.value.order}`],
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
    fetchPolicy: 'no-cache',
    nextFetchPolicy: 'no-cache',
  });

  const changeStatus = async (e) => {
    const toBeUpdateArray = check.filter(
      (item) => item.published !== e.target.value
    );
    console.log('--------------->To be update products', toBeUpdateArray);
    if (e.target.value === true) {
      let data = await Promise.all(
        toBeUpdateArray.map(async (item) => {
          try {
            console.log('called inside the update function');
            await updateProductStatus({
              variables: {
                id: item.id,
                version: item.version,
                actions: [{ publish: { scope: 'All' } }],
              },
              context: {
                target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
              },
            });
          } catch (err) {
            console.log(err);
            showNotification({
              kind: NOTIFICATION_KINDS_SIDE.error,
              domain: DOMAINS.SIDE,
              text: 'Some Error Occurred',
            });
          }
        })
      );
      refetch();
      setCheck([]);
      showNotification({
        kind: NOTIFICATION_KINDS_SIDE.success,
        domain: DOMAINS.SIDE,
        text: 'Product Updated Successfully',
      });
    } else if (e.target.value === false) {
      let data = await Promise.all(
        toBeUpdateArray.map(async (item) => {
          try {
            await updateProductStatus({
              variables: {
                id: item.id,
                version: item.version,
                actions: [{ unpublish: {} }],
              },
              context: {
                target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
              },
            });
          } catch (err) {
            showNotification({
              kind: NOTIFICATION_KINDS_SIDE.error,
              domain: DOMAINS.SIDE,
              text: 'Some Error Occurred',
            });
            console.log(err);
          }
        })
      );
      setCheck([]);
      refetch();
      showNotification({
        kind: NOTIFICATION_KINDS_SIDE.success,
        domain: DOMAINS.SIDE,
        text: 'Product Updated Successfully',
      });
    }
  };
  return {
    products: data?.products,
    loading: loading,
    error: error,
    updatedData,
    check,
    changeStatus,
    setCheck,
  };
};

export const useProductDetails = ({ id }) => {
  const { data, loading, error } = useMcQuery(FetchProductDetailsQuery, {
    variables: {
      id,
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  return {
    product: data?.product,
    loading: loading,
    error: error,
  };
};
