import LocalizedTextInput from '@commercetools-uikit/localized-text-input';

import { transformLocalizedFieldToLocalizedString } from '@commercetools-frontend/l10n';

export const docToFormValues = (product, languages) => ({
  key: product?.key ?? '',

  name: LocalizedTextInput.createLocalizedString(
    languages,
    transformLocalizedFieldToLocalizedString(
      product?.masterData.staged.nameAllLocales ?? []
    )
  ),
  description: LocalizedTextInput.createLocalizedString(
    languages,
    transformLocalizedFieldToLocalizedString(
      product?.masterData.staged.descriptionAllLocales ?? []
    )
  ),

  status: product?.masterData.published
    ? 'published'
    : product?.masterData.hasStagedChanges
    ? 'modified'
    : 'unpublished',
});

export const formValuesToDoc = (formValues) => ({
  key: formValues.key,
  description: LocalizedTextInput.omitEmptyTranslations(formValues.description),
  name: LocalizedTextInput.omitEmptyTranslations(formValues.name),
});
