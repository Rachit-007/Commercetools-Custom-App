import { defineMessages } from 'react-intl';
export default defineMessages({
  backToProductsList: {
    id: 'ProductDetails.backToProductsList',
    defaultMessage: 'Back to Products list',
  },
  duplicateKey: {
    id: 'ProductDetails.duplicateKey',
    defaultMessage: 'A Product with this key already exists.',
  },
  productUpdated: {
    id: 'ProductDetails.productUpdated',
    defaultMessage: 'Product {productName} updated',
  },
  productKeyLabel: {
    id: 'ProductDetails.productKeyLabel',
    defaultMessage: 'Product key',
  },
  productKeyLabelDesc: {
    id: 'ProductDetails.productKeyLabelDesc',
    defaultMessage:
      'Provide a unique Product key to help identify the product.',
  },
  productNameLabel: {
    id: 'ProductDetails.productNameLabel',
    defaultMessage: 'Product name',
  },
  productNameLabelDesc: {
    id: 'ProductDetails.productNameLabelDesc',
    defaultMessage: 'Enter the product name in their corresponding locales',
  },
  productDescriptionLabel: {
    id: 'ProductDetails.productDescriptionLabel',
    defaultMessage: 'Product description',
  },
  productDescriptionLabelDesc: {
    id: 'ProductDetails.productDescriptionLabelDesc',
    defaultMessage: 'Describe the product in their corresponding locales.',
  },
  productRolesLabel: {
    id: 'ProductDetails.productRolesLabel',
    defaultMessage: 'Product roles',
  },
  hint: {
    id: 'ProductDetails.hint',
    defaultMessage:
      'This page demonstrates for instance how to use forms, notifications and how to update data using GraphQL, etc.',
  },
  modalTitle: {
    id: 'ProductDetails.modalTitle',
    defaultMessage: 'Edit product',
  },
  productDetailsErrorMessage: {
    id: 'ProductDetails.errorMessage',
    defaultMessage:
      'We were unable to fetch the product details. Please check your connection, the provided product ID and try again.',
  },
});
