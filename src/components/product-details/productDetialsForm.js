import CollapsiblePanel from '@commercetools-uikit/collapsible-panel';
import LocalizedTextInput from '@commercetools-uikit/localized-text-input';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import FieldLabel from '@commercetools-uikit/field-label';
import messages from './messages';
import Spacings from '@commercetools-uikit/spacings';
import TextInput from '@commercetools-uikit/text-input';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';

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
                description={intl.formatMessage(messages.productNameLabelDesc)}
              />
              <LocalizedTextInput
                name="name"
                value={data.values.name}
                onChange={data.handleChange}
                selectedLanguage="en"
              />
            </Spacings.Stack>
            <Spacings.Stack scale="s">
              <FieldLabel
                hasRequiredIndicator
                title={intl.formatMessage(messages.productDescriptionLabel)}
                description={intl.formatMessage(
                  messages.productDescriptionLabelDesc
                )}
              />
              <LocalizedTextInput
                name="description"
                value={data.values.description}
                selectedLanguage="en"
                onChange={data.handleChange}
              />
            </Spacings.Stack>
            <Spacings.Stack scale="s">
              <FieldLabel
                hasRequiredIndicator
                title={intl.formatMessage(messages.productKeyLabel)}
                description={intl.formatMessage(messages.productKeyLabelDesc)}
              />
              <TextInput
                name="key"
                value={data.values.key}
                touched={data.touched.key}
                onChange={data.handleChange}
              />
            </Spacings.Stack>
          </Spacings.Stack>
        </div>
      </CollapsiblePanel>
      {data.dirty && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            maxWidth: '800px',
            padding: '0 10px',
            position: 'absolute',
            margin: '0 auto',
            inset: 'auto 0 0 0',
            zIndex: '1000',
          }}
        >
          <div
            style={{
              width: '100%',
              background: '#213c45',
              color: 'white',
              borderRadius: '8px 8px 0 0',
              padding: '12px 15px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <SecondaryButton
              title="Cancle"
              label="Cancle"
              // onClick={() => reset()}
            />

            <PrimaryButton type="submit" title="Save" label="Save" />
          </div>
        </div>
      )}
    </>
  );
};
ProductDetialsForm.propTypes = {
  data: PropTypes.object.isRequired,
};

export default ProductDetialsForm;
