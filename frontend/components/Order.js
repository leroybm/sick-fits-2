import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import Head from 'next/head';
import DisplayError from './ErrorMessage';
import OrderStyles from './styles/OrderStyles';
import formatMoney from '../lib/formatMoney';

const ORDER_QUERY = gql`
  query ORDER_QUERY($id: ID!) {
    Order(where: { id: $id }) {
      id
      label
      total
      charge
      user {
        id
      }
      items {
        id
        name
        description
        price
        quantity
        photo {
          altText
          image {
            publicUrlTransformed
          }
        }
      }
    }
  }
`;
export default function Order({ id }) {
  const { data, loading, error } = useQuery(ORDER_QUERY, { variables: { id } });

  if (loading) return <p>Loading...</p>;
  if (error) return <DisplayError error={error} />;
  const order = data.Order;

  return (
    <OrderStyles>
      <Head>
        <title>Sick Fits - {order.id}</title>
      </Head>

      <p>
        <span>Order Id:</span>
        <span>{order.id}</span>
      </p>

      <p>
        <span>Charge:</span>
        <span>{order.charge}</span>
      </p>

      <p>
        <span>Order Total:</span>
        <span>{formatMoney(order.total)}</span>
      </p>

      <p>
        <span>ItemCount:</span>
        <span>{order.items.length}</span>
      </p>

      <div className="items">
        {order.items.map((item) => (
          <div className="order-item" key={item.id}>
            <img
              src={item.photo.image.publicUrlTransformed}
              alt={item.photo.altText}
            />
            <div className="item-details">
              <h2>{item.name}</h2>
              <p>Qty: {item.quantity}</p>
              <p>Each: {formatMoney(item.price)}</p>
              <p>Subtotal: {formatMoney(item.price * item.quantity)}</p>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </OrderStyles>
  );
}

Order.propTypes = {
  id: PropTypes.string,
};
