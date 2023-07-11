import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import useForm from '../lib/useForm';
import Form from './styles/Form';
import DisplayError from './ErrorMessage';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    sendUserPasswordResetLink(email: $email) {
      code
      message
    }
  }
`;

export default function RequestReset() {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
  });

  const [requestReset, { loading, error, data }] = useMutation(
    REQUEST_RESET_MUTATION,
    {
      variables: inputs,
    }
  );

  return (
    <Form
      method="POST"
      onSubmit={async (event) => {
        event.preventDefault();
        await requestReset().catch(console.error);
        resetForm();
      }}
    >
      <h2>Request A Password Reset</h2>

      <DisplayError error={error} />

      <fieldset disabled={loading} aria-busy={loading}>
        {data?.sendUserPasswordResetLink === null && (
          <p>Success! Check your email for a link!</p>
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

        <button type="submit">Request Rest!</button>
      </fieldset>
    </Form>
  );
}
