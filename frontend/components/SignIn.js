import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import useForm from '../lib/useForm';
import Form from './styles/Form';
import DisplayError from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const AUTHENTICATE_USER_MUTATION = gql`
  mutation AUTHENTICATE_USER_MUTATION($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        sessionToken
        item {
          id
          name
        }
      }

      ... on UserAuthenticationWithPasswordFailure {
        code
        message
      }
    }
  }
`;

export default function SignIn() {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
  });

  const [signInUser, { loading, error, data }] = useMutation(
    AUTHENTICATE_USER_MUTATION,
    { variables: inputs, refetchQueries: [{ query: CURRENT_USER_QUERY }] }
  );

  const authError =
    data?.authenticateUserWithPassword.__typename ===
    'UserAuthenticationWithPasswordFailure'
      ? data.authenticateUserWithPassword
      : null;
  return (
    <Form
      method="POST"
      onSubmit={async (event) => {
        event.preventDefault();
        await signInUser();
        resetForm();
      }}
    >
      <h2>Sign In Your Account</h2>

      <DisplayError error={error || authError} />

      <fieldset disabled={loading} aria-busy={loading}>
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

        <button type="submit">Sign In</button>
      </fieldset>
    </Form>
  );
}
