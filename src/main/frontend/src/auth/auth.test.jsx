import {screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {http, HttpResponse} from 'msw';
import {setupServer} from 'msw/node';
import {render} from '../__tests__/react-redux';
import { App } from '../App';
import {login} from './redux';
import {store} from '../store';

describe('auth module tests', () => {
  let server;
  beforeAll(() => {
    server = setupServer();
    server.apiUrl = `${import.meta.env.VITE_REACT_APP_API_URL}`;
    server.listen();
  });
  beforeEach(() => {
    window.sessionStorage.clear();
    server.resetHandlers();
    server.use(http.all(`${server.apiUrl}/*`, () => new HttpResponse(null, {status: 404})));
    server.use(http.post(`${server.apiUrl}/auth/login`, async ({request}) => {
      let formData = await request.json();
      let response = formData.name === "admin" && formData.password === "password" ?
        new HttpResponse("a-jwt", {status: 200}) : new HttpResponse(null, {status: 401});
      return response;
    }));
  });
  afterAll(() => {
    server.close();
  });
  describe('login', () => {
    beforeEach(() => {
      window.history.pushState({}, '', '/login');
    });
    test('with valid credentials, user logs in', async () => {
      render(<App />);
      userEvent.type(screen.getByLabelText(/Username/), 'admin');
      userEvent.type(screen.getByLabelText(/Password/), 'password');
      userEvent.click(screen.getByText(/Sign In/));
      await waitFor(() => expect(window.location.pathname).toEqual('/tasks/pending'));
      expect(await screen.findByText(/Todo/, {selector: 'h2'})).toBeInTheDocument();
    });
    test('with invalid credentials, user gets credentials error', async () => {
      render(<App />);
      userEvent.type(screen.getByLabelText(/Username/), 'admin');
      userEvent.type(screen.getByLabelText(/Password/), 'wrong');
      userEvent.click(screen.getByText(/Sign In/));
      expect(within(await screen.findByRole('alert')).getByText(/Invalid credentials/)).toBeInTheDocument();
    });
    test("with server error, user gets generic error", async () => {
      server.use(http.post(`${server.apiUrl}/auth/login`, () => new HttpResponse(null, {status: 501})));
      render(<App />);
      userEvent.type(screen.getByLabelText(/Username/), 'admin');
      userEvent.type(screen.getByLabelText(/Password/), 'password');
      userEvent.click(screen.getByText(/Sign In/));
      expect(within(await screen.findByRole('alert')).getByText(/Error/)).toBeInTheDocument();
    });
  });
  test('user can log out of the application', async () => {
    await store.dispatch(login({name: 'user', password: 'password'}));
    window.history.pushState({}, '', '/tasks');
    render(<App />);
    userEvent.click(screen.getByLabelText(/Profile/));
    const logoutMenuItem = screen.getByText(/Logout/);
    userEvent.click(logoutMenuItem);
    await waitFor(() => expect(window.location.pathname).toEqual('/login'));
  });

})