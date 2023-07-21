import {
  useDataTableSortingState,
  usePaginationState,
} from '@commercetools-uikit/hooks';
import { ContentNotification } from '@commercetools-uikit/notifications';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import React from 'react';
import { useProducts } from '../../hooks/use-products-connector/use-products-connector';
import DataTable from '@commercetools-uikit/data-table';
import Stamp from '@commercetools-uikit/stamp';
import Spacings from '@commercetools-uikit/spacings';
import CheckboxInput from '@commercetools-uikit/checkbox-input';
import { getErrorMessage } from '../../helpers';
import { Pagination } from '@commercetools-uikit/pagination';
import messages from './messages';
import Text from '@commercetools-uikit/text';
import ProductDetails from '../product-details';
import { Switch, useHistory, useRouteMatch, Route } from 'react-router';

const columns = [
  { key: 'checkbox', label: '' },
  { key: 'masterData', label: 'Product Name', isSortable: true },
  { key: 'type', label: 'Product Type' },
  { key: 'key', label: 'Product Key', isSortable: true },
  { key: 'status', label: 'Status' },
  { key: 'createdAt', label: 'Date Created', isSortable: true },
  { key: 'lastModifiedAt', label: 'Date Modified', isSortable: true },
];

const itemRenderer = (item, column) => {
  switch (column.key) {
    case 'checkbox':
      return <CheckboxInput></CheckboxInput>;
    case 'masterData':
      return item.masterData.current.name;
    case 'type':
      return item.productType.name;
    case 'status':
      if (item.masterData.published && item.masterData.hasStagedChanges) {
        return <Stamp tone="warning" label="modified"></Stamp>;
      } else if (
        item.masterData.published &&
        !item.masterData.hasStagedChanges
      ) {
        return <Stamp tone="primary" label="Published"></Stamp>;
      } else if (!item.masterData.published) {
        return <Stamp tone="critical" label="Unpublished"></Stamp>;
      }
    case 'createdAt':
      const createdate = new Date(item.createdAt);

      const creationDate =
        createdate.getDay() +
        '/' +
        createdate.getMonth() +
        '/' +
        createdate.getFullYear() +
        ' ' +
        createdate.getHours() +
        ':' +
        createdate.getMinutes();

      return creationDate;
    case 'lastModifiedAt':
      const newDate = new Date(item.lastModifiedAt);

      const finalDate =
        newDate.getDay() +
        '/' +
        newDate.getMonth() +
        '/' +
        newDate.getFullYear() +
        ' ' +
        newDate.getHours() +
        ':' +
        newDate.getMinutes();

      return finalDate;

    default:
      return item[column.key];
  }
};

const Products = () => {
  const match = useRouteMatch();
  const { push } = useHistory();
  const { page, perPage } = usePaginationState();
  const tableSorting = useDataTableSortingState({ key: 'key', order: 'asc' });

  const { products, loading, error } = useProducts({
    page,
    perPage,
    tableSorting,
  });

  if (error) {
    return (
      <ContentNotification type="error">
        <Text.Body>{getErrorMessage(error)}</Text.Body>
      </ContentNotification>
    );
  }

  console.log(products);
  return (
    <>
      {loading && <LoadingSpinner />}
      {products ? (
        <Spacings.Stack scale="l">
          <Spacings.Stack scale="l">
            <Text.Headline as="h1" intlMessage={messages.title} />
          </Spacings.Stack>
          <Spacings.Stack scale="l">
            <DataTable
              columns={columns}
              rows={products.results}
              sortedBy={tableSorting.value.key}
              itemRenderer={(item, column) => itemRenderer(item, column)}
              sortDirection={tableSorting.value.order}
              onSortChange={tableSorting.onChange}
              onRowClick={(row) => push(`${match.url}/${row.id}`)}
            />
            <Pagination
              page={page.value}
              onPageChange={page.onChange}
              perPage={perPage.value}
              onPerPageChange={perPage.onChange}
              totalItems={products.total}
            />
            <Switch>
              <Route path={`${match.path}/:id`}>
                <ProductDetails onClose={() => push(`${match.url}`)} />
              </Route>
            </Switch>
          </Spacings.Stack>
        </Spacings.Stack>
      ) : (
        <></>
      )}
    </>
  );
};

export default Products;
