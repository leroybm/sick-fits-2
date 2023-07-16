import PropTypes from 'prop-types';
import Order from '../../components/Order';

export default function OrderPage({ query }) {
  const { id } = query;

  if (!id) return <p>Order not found!</p>;

  return <Order id={id} />;
}

OrderPage.propTypes = {
  query: PropTypes.shape({
    id: PropTypes.string,
  }),
};
