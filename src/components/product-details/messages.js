import { defineMessages } from 'react-intl';

export default defineMessages({
  backToProductsList: {
    id: 'ProductsDetails.backToProductsList',
    defaultMessage: 'Back to products list',
  },
  duplicateKey: {
    id: 'ProductsDetails. ',
    defaultMessage: 'A product with this key already exists.',
  },
  productUpdated: {
    id: 'ProductsDetails.productUpdated',
    defaultMessage: 'Products {productName} updated',
  },
  productKeyLabel: {
    id: 'ProductsDetails.productKeyLabel',
    defaultMessage: 'Products key',
  },
  productNameLabel: {
    id: 'ProductsDetails.productNameLabel',
    defaultMessage: 'Products name',
  },
  productRolesLabel: {
    id: 'ProductsDetails.productRolesLabel',
    defaultMessage: 'Products roles',
  },
  hint: {
    id: 'ProductsDetails.hint',
    defaultMessage:
      'This page demonstrates for instance how to use forms, notifications and how to update data using GraphQL, etc.',
  },
  modalTitle: {
    id: 'ProductsDetails.modalTitle',
    defaultMessage: 'Edit product',
  },
  productDetailsErrorMessage: {
    id: 'ProductsDetails.errorMessage',
    defaultMessage:
      'We were unable to fetch the product details. Please check your connection, the provided product ID and try again.',
  },
});
