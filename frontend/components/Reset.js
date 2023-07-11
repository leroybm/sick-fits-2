import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import useForm from '../lib/useForm';
import Form from './styles/Form';
import DisplayError from './ErrorMessage';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $email: String!
    $password: String!
    $token: String!
  ) {
    redeemUserPasswordResetToken(
      email: $email
      password: $password
      token: $token
    ) {
      message
      code
    }
  }
`;

export default function Reset({ token }) {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
  });

  const [requestReset, { loading, error, data }] = useMutation(RESET_MUTATION, {
    variables: { ...inputs, token },
  });

  const resetError = data?.redeemUserPasswordResetToken?.code
    ? data.redeemUserPasswordResetToken
    : null;
  return (
    <Form
      method="POST"
      onSubmit={async (event) => {
        event.preventDefault();
        await requestReset().catch(console.error);
        resetForm();
      }}
    >
      <h2>Reset Your Password</h2>

      <DisplayError error={error || resetError} />

      <fieldset disabled={loading} aria-busy={loading}>
        {data?.redeemUserPasswordResetToken === null && (
          <p>Success! Your password was reset!</p>
        )}

        <label htmlFor="email">
          Email
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={inputs.email}
            onChange={handleChange}
            autoComplete="email"
          />
        </label>

        <label htmlFor="password">
          Password
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={inputs.password}
            onChange={handleChange}
            autoComplete="password"
          />
        </label>

        <button type="submit">Request Rest!</button>
      </fieldset>
    </Form>
  );
}
