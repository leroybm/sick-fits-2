import { list } from '@keystone-next/keystone/schema';
import { integer, relationship, select, text } from '@keystone-next/fields';
import { isSignedIn, rules } from '../access';

enum StatusValue {
  DRAFT = 'DRAFT',
  AVAIALBLE = 'AVAIALBLE',
  UNAVAILABLE = 'UNAVAILABLE',
}

export const Product = list({
  access: {
    create: isSignedIn,
    read: rules.canReadProducts,
    update: rules.canManageProducts,
    delete: rules.canManageProducts,
  },
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
    user: relationship({
      ref: 'User.products',
      defaultValue: ({ context }) => ({
        connect: { id: context.session.itemId },
      }),
    }),
  },
});
