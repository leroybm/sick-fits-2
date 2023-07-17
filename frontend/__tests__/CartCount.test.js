import { render } from '@testing-library/react';
import { waitFor } from '@babel/core/lib/gensync-utils/async';
import CartCount from '../components/CartCount';

describe('<CartCount />', () => {
  it('should render', () => {
    render(<CartCount count={10} />);
  });

  it('should match snapshot', () => {
    const { container } = render(<CartCount count={11} />);

    expect(container).toMatchSnapshot();
  });

  it('should update via props', () => {
    const { container, rerender, debug } = render(<CartCount count={12} />);

    expect(container.textContent).toBe('12');
    rerender(<CartCount count={13} />);
    expect(container.textContent).toBe('1312');
    waitFor(() => {
      expect(container.textContent).toBe('13');
      expect(container).toMatchSnapshot();
    });
  });
});
