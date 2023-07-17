import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import SingleProduct, { SINGLE_ITEM_QUERY } from '../components/SingleProduct';
import { fakeItem } from '../lib/testUtils';

const mockProduct = fakeItem();

const mocks = [
  {
    // When someone requests this query/varaible combo
    request: {
      query: SINGLE_ITEM_QUERY,
      variables: {
        id: '123',
      },
    },
    result: {
      data: {
        Product: mockProduct,
      },
    },
  },
];

describe('<SingleProduct />', () => {
  it('should render with proper data', async () => {
    // Create fake data
    const { container } = render(
      <MockedProvider mocks={mocks}>
        <SingleProduct id="123" />
      </MockedProvider>
    );
    // wait for test id to show up
    await screen.findByTestId('singleProduct');
    expect(container).toMatchSnapshot();
  });

  it('should render an error when an item is not found', async () => {
    const errorMock = [
      {
        // When someone requests this query/varaible combo
        request: {
          query: SINGLE_ITEM_QUERY,
          variables: {
            id: '123',
          },
        },
        result: {
          errors: [{ message: 'Item not found!' }],
        },
      },
    ];

    const { container, debug } = render(
      <MockedProvider mocks={errorMock}>
        <SingleProduct id="123" />
      </MockedProvider>
    );

    await screen.findByTestId('graphql-error');
    expect(container).toHaveTextContent('Shoot!');
    expect(container).toHaveTextContent('Item not found!');
  });
});
