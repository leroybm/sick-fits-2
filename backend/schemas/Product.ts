import { list } from '@keystone-next/keystone/schema';
import { integer, relationship, select, text } from '@keystone-next/fields';

enum StatusValue {
  DRAFT = 'DRAFT',
  AVAIALBLE = 'AVAIALBLE',
  UNAVAILABLE = 'UNAVAILABLE',
}

export const Product = list({
  // TODO access:
  fields: {
    name: text({ isRequired: true }),
    description: text({
      ui: {
        displayMode: 'textarea',
      },
    }),
    status: select({
      options: [
        { label: 'Draft', value: StatusValue.DRAFT },
        { label: 'Available', value: StatusValue.AVAIALBLE },
        { label: 'Unavailable', value: StatusValue.UNAVAILABLE },
      ],
      defaultValue: StatusValue.DRAFT,
      ui: {
        displayMode: 'segmented-control',
        createView: {
          fieldMode: 'hidden',
        },
      },
    }),
    price: integer(),
    photo: relationship({
      ref: 'ProductImage.product',
      ui: {
        displayMode: 'cards',
        cardFields: ['image', 'altText'],
        inlineCreate: { fields: ['image', 'altText'] },
        inlineEdit: { fields: ['image', 'altText'] },
      },
    }),
    // TODO: Photo
  },
});
