import { KeystoneContext } from '@keystone-next/types';
import {
  CartItemCreateInput,
  OrderCreateInput,
} from '../.keystone/schema-types';
import stripeConfig from '../lib/strip';

interface CheckoutArguments {
  token: string;
}

export default async function checkout(
  root: any,
  { token }: CheckoutArguments,
  context: KeystoneContext
): Promise<OrderCreateInput> {
  // Make sure the user is signed in
  const userId = context.session.itemId;

  if (!userId) {
    throw new Error('Sorry! You must be logged in to create an order!');
  }

  const user = await context.lists.User.findOne({
    where: { id: userId },
    resolveFields: `
      id
      name
      email
      cart {
        id
        quantity
        product {
          name
          price
          description
          id
          photo {
            id
            image {
              id
              publicUrlTransformed
            }
          }
        }
      }
    `,
  });

  // Calculate total price
  const cartItems = user.cart.filter((cartItem) => cartItem.product);
  const amount = cartItems.reduce(
    (tally: number, cartItem: CartItemCreateInput) =>
      tally + cartItem.quantity * cartItem.product.price,
    0
  );

  // Create charge with stripe library
  const charge = await stripeConfig.paymentIntents
    .create({
      amount,
      currency: 'USD',
      confirm: true,
      payment_method: token,
    })
    .catch((error) => {
      console.log(error);
      throw new Error(error.message);
    });

  // Convert the cartItems to OrderItems
  const orderItems = cartItems.map((cartItem) => {
    const orderItem = {
      name: cartItem.product.name,
      description: cartItem.product.description,
      price: cartItem.product.price,
      quantity: cartItem.quantity,
      photo: {
        connect: { id: cartItem.product.photo.id },
      },
    };
    return orderItem;
  });

  // Create order and return it
  const order = await context.lists.Order.createOne({
    data: {
      total: charge.amount,
      charge: charge.id,
      items: { create: orderItems },
      user: { connect: { id: userId } },
    },
  });

  const cartItemsIds = user.cart.map((cartItem) => cartItem.id);
  await context.lists.CartItem.deleteMany({
    ids: cartItemsIds,
  });

  return order;
}
