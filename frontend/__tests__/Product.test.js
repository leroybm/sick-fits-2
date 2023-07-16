import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import Product from '../components/Product';
import { fakeItem } from '../lib/testUtils';

describe('<Product/>', () => {
  let product;

  beforeEach(() => {
    product = fakeItem();
  });

  it('should render the price tag and title', () => {
    const { container, debug } = render(
      <MockedProvider>
        <Product product={product} />
      </MockedProvider>
    );

    expect(screen.getByText('50 €')).toBeInTheDocument();
    const link = container.querySelector('a');
    expect(link).toHaveAttribute('href', '/product/abc123');
    expect(link).toHaveTextContent(product.name);
  });

  it('should render and match the snapshot', () => {
    const { container, debug } = render(
      <MockedProvider>
        <Product product={product} />
      </MockedProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it('should render the image properly', () => {
    const { container, debug } = render(
      <MockedProvider>
        <Product product={product} />
      </MockedProvider>
    );

    const img = screen.getByAltText(product.name);
    expect(img).toBeInTheDocument();
  });
});
