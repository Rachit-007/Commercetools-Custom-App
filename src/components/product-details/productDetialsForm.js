import React from 'react';
import Label from '@commercetools-uikit/label';
import TextInput from '@commercetools-uikit/text-input';

const ProductDetialsForm = ({ product }) => {
  return (
    <div>
      {' '}
      <form>
        <Label isRequiredIndicatorVisible={true} isBold={true}>
          Product Name
        </Label>
        <TextInput value={product.masterData.current.name} />
        <br />
        <Label isBold={false}>Product Sku</Label>
        <TextInput value={product.skus} />
        <br />

        <Label isBold={false}>Product Key</Label>
        <TextInput value={product.key} />
        <br />

        <Label isBold={false}>Product Type</Label>
        <TextInput value={product.productType.name} />
        <br />

        <Label isBold={false}>Description</Label>
        <TextInput value={product.productType.description} />
        <br />
      </form>
    </div>
  );
};

export default ProductDetialsForm;
