import {
  useMcLazyQuery,
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
import SearchProductsQuery from './search-product-ctp.graphql';
import UpdateProductDetailsMutation from './update-product-details.ctp.graphql';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import { useState } from 'react';
import { createSyncProducts } from '@commercetools/sync-actions';
import { convertToActionData, createGraphQlUpdateActions } from '../../helpers';

import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';

import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';

import {
  formatLocalizedString,
  transformLocalizedFieldToLocalizedString,
} from '@commercetools-frontend/l10n';

export const useProducts = ({ page, perPage, tableSorting }) => {
  const [check, setCheck] = useState([]);
  const [updateProductStatus, { data: updatedData }] =
    useMcMutation(ChangeProductStatus);
  const showNotification = useShowNotification();

  const [fetchSearchProducts, { data: searchedProductsData }] =
    useMcLazyQuery(SearchProductsQuery);

  const searchProducts = async (value) => {
    try {
      await fetchSearchProducts({
        variables: {
          term: value,
        },
        context: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const resultString = searchedProductsData?.productProjectionSearch?.results
    .map((id) => `"${id.id}"`)
    .join(',');
  const finalString = resultString ? `id in (${resultString})` : null;

  const { data, loading, error, refetch } = useMcQuery(FetchProductQuery, {
    variables: {
      limit: perPage.value,
      offset: (page.value - 1) * perPage.value,
      sort: [`${tableSorting.value.key} ${tableSorting.value.order}`],
      where: finalString,
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  const changeStatus = async (e) => {
    const toBeUpdateArray = check.filter(
      (item) => item.published !== e.target.value || item.staged === true
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
      // refetch();
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
    searchProducts,
    refetch,
    setCheck,
  };
};

export const useProductDetails = ({ id }) => {
  const { data, loading, error, refetch } = useMcQuery(
    FetchProductDetailsQuery,
    {
      variables: {
        id,
      },
      context: {
        target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
      },
    }
  );

  const [updateProductStatus, { data: updatedData }] =
    useMcMutation(ChangeProductStatus);

  return {
    updateProductStatus,
    refetch,
    updatedData,
    product: data?.product,
    loading: loading,
    error: error,
  };
};

export const useProductUpdater = () => {
  const [updateProductDetails, { loading }] = useMcMutation(
    UpdateProductDetailsMutation
  );

  const syncStores = createSyncProducts();

  const execute = async ({ originalDraft, nextDraft }) => {
    const actions = syncStores.buildActions(
      nextDraft,
      convertToActionData(originalDraft)
    );
    try {
      const data = await updateProductDetails({
        context: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        },
        variables: {
          productId: originalDraft.id,
          version: originalDraft.version,
          actions: createGraphQlUpdateActions(actions),
        },
      });
      return data;
    } catch (graphQlResponse) {
      throw extractErrorFromGraphQlResponse(graphQlResponse);
    }
  };

  return { execute, loading };
};

export const useLocalLang = () => {
  const { dataLocale, projectLanguages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale,
    projectLanguages: context.project.languages,
  }));

  /**

   * To get localized String of name

   * @param {{allLocales:Object,key:String}}

   */

  const getLocalName = ({ allLocales, key }) =>
    formatLocalizedString(
      { name: transformLocalizedFieldToLocalizedString(allLocales) },
      {
        key: key,
        locale: dataLocale,
        fallbackOrder: projectLanguages,
        fallback: NO_VALUE_FALLBACK,
      }
    );

  return { getLocalName };
};
