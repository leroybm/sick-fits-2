import RequestReset from '../components/RequestReset';
import Reset from '../components/Reset';

export default function ResetPage({ query }) {
  const { token } = query;

  if (!token)
    return (
      <div>
        <p>Sorry you must supply a token!</p>
        <RequestReset />
      </div>
    );

  return <Reset token={token} />;
}
