import { useMcQuery } from '@commercetools-frontend/application-shell';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import FetchProductQuery from './fetch-products-ctp.graphql';
import FetchProductDetailsQuery from './fetch-product-details.ctp.graphql';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

export const useProducts = ({ page, perPage, tableSorting }) => {
  const { data, loading, error } = useMcQuery(FetchProductQuery, {
    variables: {
      limit: perPage.value,
      offset: (page.value - 1) * perPage.value,
      sort: [`${tableSorting.value.key} ${tableSorting.value.order}`],
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });
  return { products: data?.products, loading: loading, error: error };
};

export const useProductDetails = ({ id }) => {
  const { register, handleSubmit, setValue } = useForm();
  console.log(id);
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
    register,
    handleSubmit,
    setValue,
  };
};
