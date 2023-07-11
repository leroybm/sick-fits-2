import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { logPlugin } from '@babel/preset-env/lib/debug';
import useForm from '../lib/useForm';
import Form from './styles/Form';
import DisplayError from './ErrorMessage';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    createUser(data: { email: $email, name: $name, password: $password }) {
      id
      name
      email
    }
  }
`;

export default function SignUp() {
  const { inputs, handleChange, resetForm } = useForm({
    name: '',
    email: '',
    password: '',
  });

  const [signUp, { loading, error, data }] = useMutation(SIGNUP_MUTATION, {
    variables: inputs,
  });

  return (
    <Form
      method="POST"
      onSubmit={async (event) => {
        event.preventDefault();
        await signUp().catch(console.error);
        resetForm();
      }}
    >
      <h2>Sign Up For Account</h2>

      <DisplayError error={error} />

      <fieldset disabled={loading} aria-busy={loading}>
        {data?.createUser && (
          <p>
            Signed up with {data.createUser.email} - Please go ahead and sign
            in!
          </p>
        )}

        <label htmlFor="name">
          Name
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            value={inputs.name}
            onChange={handleChange}
            autoComplete="name"
          />
        </label>

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
