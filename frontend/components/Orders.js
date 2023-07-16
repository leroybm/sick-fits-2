import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import Link from 'next/link';
import Head from 'next/head';
import DisplayError from './ErrorMessage';
import OrderItemStyles from './styles/OrderItemStyles';
import formatMoney from '../lib/formatMoney';

const USER_ORDER_QUERY = gql`
  query USER_ORDER_QUERY {
    allOrders {
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

const OrderUl = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  grid-gap: 4rem;
`;

function InlineOrder({ order }) {
  const itemQuantity = order.items.reduce(
    (tally, item) => tally + item.quantity,
    0
  );

  return (
    <OrderItemStyles key={order.id}>
      <Link href={`/order/${order.id}`}>
        <a>
          <div className="order-meta">
            <p>
              {itemQuantity} Item{itemQuantity > 1 ? 's' : ''}
            </p>
            <p>
              {order.items.length} Product{order.items.length === 1 ? '' : 's'}
            </p>
            <p>{formatMoney(order.total)}</p>
          </div>
          <div className="images">
            {order.items.map((item) => (
              <img
                key={item.id}
                src={item.photo.image?.publicUrlTransformed}
                alt={item.photo.altText}
              />
            ))}
          </div>
        </a>
      </Link>
    </OrderItemStyles>
  );
}

export default function Orders() {
  const { data, loading, error } = useQuery(USER_ORDER_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <DisplayError error={error} />;
  const { allOrders } = data;

  return (
    <div>
      <Head>
        <title>Your Orders ({allOrders.length})</title>
      </Head>
      <h2>You have {allOrders.length} orders!</h2>

      <OrderUl>
        {allOrders.map((order) => (
          <InlineOrder order={order} key={order.id} />
        ))}
      </OrderUl>
    </div>
  );
}
