import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, fireEvent, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import Login from '../Login';
import authReducer from '../../../reducers/auth';
import Alert from '../../layout/Alert';
import store from '../../../store';

const initialStateReducer = {
  token: null,
  isAuthenticated: true,
  loading: true,
  user: null,
};

function renderWithRedux(
  ui,
  { initialState, store = createStore(authReducer, initialState) } = {}
) {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    // adding `store` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    store,
  };
}

test('Test del reducer dell autenticazione', () => {
  expect(authReducer(undefined, {})).toEqual({
    token: null,
    isAuthenticated: null,
    loading: true,
    user: null,
  });
});

test('Test di una action attraverso il reducer ', () => {
  expect(
    authReducer(initialStateReducer, { type: 'USER_LOADED', action: null })
  ).toEqual({
    token: null,
    isAuthenticated: true,
    loading: false,
    user: undefined,
  });
});

test('Render component con stato iniziale', async () => {
  renderWithRedux(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
    {
      initialState: {
        alert: [],
        auth: {
          token: null,
          isAuthenticated: null,
          loading: false,
          user: null,
        },
        profile: {
          profile: null,
          profiles: [],
          repos: [],
          loading: true,
          error: {},
        },
        post: { posts: [], post: null, loading: true, error: {} },
      },
    }
  );
  expect(screen.getByTestId(/Login/i)).toBeInTheDocument();
});

test('Render dei due campi di input', async () => {
  renderWithRedux(
    <Provider store={store}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </Provider>,
    {
      initialState: {
        alert: [],
        auth: {
          token: null,
          isAuthenticated: null,
          loading: false,
          user: null,
        },
        profile: {
          profile: null,
          profiles: [],
          repos: [],
          loading: true,
          error: {},
        },
        post: { posts: [], post: null, loading: true, error: {} },
      },
    }
  );
  expect(screen.getByTestId(/email/i)).toBeInTheDocument();
  expect(screen.getByTestId(/password/i)).toBeInTheDocument();
});

/* describe('user logs in successfully and token added to localstorage', () => {
  it('allows the user to login successfully', async () => {
    // mock window.fetch for the test
    const UserResponse = { token: 'token' };

    jest.spyOn(window, 'fetch').mockImplementationOnce(() => {
      return Promise.resolve({
        json: () => Promise.resolve(UserResponse),
      });
    });

    // Render the Login component
    const { getByTestId, state } = renderWithRedux(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>,
      {
        initialState: {
          alert: [],
          auth: {
            token: null,
            isAuthenticated: null,
            loading: false,
            user: null,
          },
          profile: {
            profile: null,
            profiles: [],
            repos: [],
            loading: true,
            error: {},
          },
          post: { posts: [], post: null, loading: true, error: {} },
        },
      }
    );

    // fill out the form
    await act(async () => {
      fireEvent.change(screen.getByTestId('email'), {
        target: { value: 'prova1@gmail.com' },
      });

      fireEvent.change(screen.getByTestId('password'), {
        target: { value: '12345678' },
      });
    });

    //Submit the form
    await act(async () => {
      fireEvent.submit(getByTestId('form'));
    });


    // Expect local token to be set
    await act(async () => {
      console.log(store.getState());
      expect(window.localStorage.getItem('token')).toEqual(UserResponse.token);
    });
  });
});
 */
