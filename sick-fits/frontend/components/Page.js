import PropTypes from 'prop-types';
import Header from './Header';

export default function Page({ children, cool }) {
  return (
    <div>
      <Header />
      <div>
        <h2>I'm the page component</h2>
      </div>
    </div>
  );
}

Page.propTypes = {
  cool: PropTypes.string,
  children: PropTypes.any,
};
