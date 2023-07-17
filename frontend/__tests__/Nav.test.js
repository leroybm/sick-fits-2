import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { debug } from 'prettier/doc';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeCartItem, fakeUser } from '../lib/testUtils';
import { CartStateProvider } from '../lib/cartState';
import Nav from '../components/Nav';

const notSignedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { authenticatedItem: null } },
  },
];

const signedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { authenticatedItem: fakeUser() } },
  },
];

const signedInWithCartItemsMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        authenticatedItem: fakeUser({
          cart: [fakeCartItem(), fakeCartItem(), fakeCartItem()],
        }),
      },
    },
  },
];

describe('<Nav />', () => {
  it('should render minimal nav when signed out', () => {
    const { container } = render(
      <CartStateProvider>
        <MockedProvider mocks={notSignedInMocks}>
          <Nav />
        </MockedProvider>
      </CartStateProvider>
    );

    expect(container).toMatchSnapshot();
    [
      {
        text: 'Products',
        href: '/products',
      },
      {
        text: 'Sign In',
        href: '/signin',
      },
    ].forEach(({ text, href }) => {
      expect(container).toHaveTextContent(text);
      const link = screen.getByText(text);
      expect(link).toHaveAttribute('href', href);
    });
  });

  it('should render a full nav when signedin', async () => {
    const { container } = render(
      <CartStateProvider>
        <MockedProvider mocks={signedInMocks}>
          <Nav />
        </MockedProvider>
      </CartStateProvider>
    );
    await screen.findByText('Account');

    expect(container).toMatchSnapshot();
    [
      {
        text: 'Products',
        href: '/products',
      },
      {
        text: 'Sell',
        href: '/sell',
      },
      {
        text: 'Orders',
        href: '/orders',
      },
      {
        text: 'Account',
        href: '/account',
      },
    ].forEach(({ text, href }) => {
      expect(container).toHaveTextContent(text);
      const link = screen.getByText(text);
      expect(link).toHaveAttribute('href', href);
    });

    expect(container).toHaveTextContent('Sign Out');
    expect(container).toHaveTextContent('My Cart');
  });

  it('should render the amount of items in the cart', async () => {
    render(
      <CartStateProvider>
        <MockedProvider mocks={signedInWithCartItemsMocks}>
          <Nav />
        </MockedProvider>
      </CartStateProvider>
    );
    await screen.findByText('Account');
    expect(screen.getByText(9)).toBeInTheDocument();
  });
});
