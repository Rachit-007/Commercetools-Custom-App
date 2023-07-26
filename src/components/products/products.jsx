import {
  useDataTableSortingState,
  usePaginationState,
} from '@commercetools-uikit/hooks';
import { ContentNotification } from '@commercetools-uikit/notifications';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import React from 'react';
import {
  useLocalLang,
  useProducts,
} from '../../hooks/use-products-connector/use-products-connector';
import DataTable from '@commercetools-uikit/data-table';
import Stamp from '@commercetools-uikit/stamp';
import Spacings from '@commercetools-uikit/spacings';
import SpacingsInline from '@commercetools-uikit/spacings-inline';
import SelectInput from '@commercetools-uikit/select-input';
import CheckboxInput from '@commercetools-uikit/checkbox-input';
import { getErrorMessage } from '../../helpers';
import { Pagination } from '@commercetools-uikit/pagination';
import messages from './messages';
import { DotIcon } from '@commercetools-uikit/icons';
import Text from '@commercetools-uikit/text';
import ProductDetails from '../product-details';
import { Switch, useHistory, useRouteMatch, Route } from 'react-router';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { includes, some } from 'lodash';
import SearchTextInput from '@commercetools-uikit/search-text-input';

import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';

const Products = () => {
  const match = useRouteMatch();
  const { push } = useHistory();
  const { page, perPage } = usePaginationState();
  const tableSorting = useDataTableSortingState({ key: 'key', order: 'asc' });

  const {
    products,
    loading,
    error,
    check,
    setCheck,
    changeStatus,
    refetch,
    searchProducts,
  } = useProducts({
    page,
    perPage,
    tableSorting,
  });

  const columns = [
    {
      key: 'checkbox',
      label: (
        <CheckboxInput
          onChange={() => {
            if (check.length === products.results.length) {
              setCheck([]);
            } else {
              const allCheck = products.results.map((item) => {
                return {
                  id: item.id,
                  version: item.version,
                  published: item.masterData.published,
                  staged: item.masterData.hasStagedChanges,
                };
              });
              setCheck(allCheck);
            }
          }}
          isChecked={check.length === products?.results?.length}
        ></CheckboxInput>
      ),
      shouldIgnoreRowClick: true,
    },
    { key: 'masterData', label: 'Product Name', isSortable: true },
    { key: 'type', label: 'Product Type' },
    { key: 'key', label: 'Product Key', isSortable: true },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Date Created', isSortable: true },
    { key: 'lastModifiedAt', label: 'Date Modified', isSortable: true },
  ];

  const { getLocalName } = useLocalLang();

  const itemRenderer = (item, column) => {
    switch (column.key) {
      case 'checkbox':
        return (
          <CheckboxInput
            onChange={() => {
              if (some(check, { id: item.id })) {
                setCheck(check.filter((checkItem) => checkItem.id !== item.id));
              } else {
                setCheck([
                  ...check,
                  {
                    id: item.id,
                    version: item.version,
                    published: item.masterData.published,
                    staged: item.masterData.hasStagedChanges,
                  },
                ]);
              }
            }}
            isChecked={some(check, { id: item.id }) === true}
          ></CheckboxInput>
        );
      case 'masterData':
        return getLocalName({
          allLocales: item.masterData.staged.nameAllLocales,
          key: 'name',
        });
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

  if (error) {
    return (
      <ContentNotification type="error">
        <Text.Body>{getErrorMessage(error)}</Text.Body>
      </ContentNotification>
    );
  }

  return (
    <>
      {loading && <LoadingSpinner />}

      {products ? (
        <>
          <Spacings.Stack scale="l">
            <Spacings.Stack scale="l">
              <Text.Headline as="h1" intlMessage={messages.title} />
            </Spacings.Stack>
            <SearchTextInput
              value="foo"
              onSubmit={(value) => searchProducts(value)}
              onReset={() => alert('reset')}
            />
            <SpacingsInline alignItems="center">
              <div style={{ maxWidth: '200px', width: '100%' }}>
                <SelectInput
                  name="form-field-name"
                  placeholder="Actions"
                  onChange={(e) => changeStatus(e)}
                  options={[
                    {
                      value: true,
                      label: (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <DotIcon
                            color={check.length === 0 ? 'neutral60' : 'primary'}
                            size="medium"
                          />
                          <p style={{ paddingLeft: '10px' }}>Publish</p>
                        </div>
                      ),
                      isDisabled: check.length === 0,
                    },
                    {
                      value: false,
                      label: (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <DotIcon
                            color={check.length === 0 ? 'neutral60' : 'error'}
                            size="medium"
                          />
                          <p style={{ paddingLeft: '10px' }}>Unpublish</p>
                        </div>
                      ),
                      isDisabled: check.length === 0,
                    },
                  ]}
                />
              </div>
              {check.length > 0 && (
                <>
                  <Text.Detail tone="primary" isBold>
                    {check.length}{' '}
                  </Text.Detail>
                  <Text.Detail isBold>Product Selected</Text.Detail>
                </>
              )}
            </SpacingsInline>
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
                  <ProductDetails
                    onClose={() => push(`${match.url}`)}
                    refetch={refetch}
                  />
                </Route>
              </Switch>
            </Spacings.Stack>
          </Spacings.Stack>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Products;
