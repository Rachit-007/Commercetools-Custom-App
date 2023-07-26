import CollapsiblePanel from '@commercetools-uikit/collapsible-panel';

import LocalizedTextInput from '@commercetools-uikit/localized-text-input';

import Text from '@commercetools-uikit/text';

import { useIntl } from 'react-intl';

import PropTypes from 'prop-types';

import Label from '@commercetools-uikit/label';

import FieldLabel from '@commercetools-uikit/field-label';

import TextField from '@commercetools-uikit/text-field';

import messages from './messages';

import { useFormik } from 'formik';

import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';

import Spacings from '@commercetools-uikit/spacings';

import SpacingsInline from '@commercetools-uikit/spacings-inline';

import TextInput from '@commercetools-uikit/text-input';

const ProductDetialsForm = ({ data }) => {
  const intl = useIntl();

  return (
    <>
      <CollapsiblePanel condensed header="General Information">
        <div style={{ width: '100%' }}>
          <Spacings.Stack>
            <Spacings.Stack scale="s">
              <FieldLabel
                hasRequiredIndicator
                title={intl.formatMessage(messages.productNameLabel)}
                // description={intl.formatMessage(messages.productNameLabelDesc)}
              />

              <TextInput
                name="name"
                value={data.values.name}
                selectedLanguage="en"
              />
            </Spacings.Stack>

            <Spacings.Stack scale="s">
              <FieldLabel
                hasRequiredIndicator
                // title={intl.formatMessage(messages.productDescriptionLabel)}
                // description={intl.formatMessage(
                //   messages.productDescriptionLabelDesc
                // )}
              />

              <TextInput
                name="name"
                value={data.values.name}
                selectedLanguage="en"
              />
            </Spacings.Stack>

            <Spacings.Stack scale="s">
              <FieldLabel
                hasRequiredIndicator
                title={intl.formatMessage(messages.productKeyLabel)}
                // description={intl.formatMessage(messages.productKeyLabelDesc)}
              />

              <TextInput
                name="key"
                value={data.values.key}
                touched={data.touched.key}
                // onChange={data.handleChange}
              />
            </Spacings.Stack>
          </Spacings.Stack>
        </div>
      </CollapsiblePanel>
    </>
  );
};

ProductDetialsForm.propTypes = {
  data: PropTypes.object.isRequired,
};

export default ProductDetialsForm;
