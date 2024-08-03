import { screen } from "@testing-library/react";
import {http, HttpResponse} from 'msw';
import {setupServer} from 'msw/node';
import { render } from "./__tests__/react-redux";
import {login} from './auth';
import {store} from './store';
import {App} from './App';

describe('Router tests', () => {
  let server;
  beforeAll(() => {
    server = setupServer();
    server.apiUrl = `${import.meta.env.VITE_REACT_APP_API_URL}`;
    server.events.on('request:start', ({request}) => {
      console.log('Outgoing:', request.method, request.url)
    });
    server.listen();
  });
  beforeEach(() => {
    window.sessionStorage.clear();
    server.resetHandlers();
    server.use(http.all(`${server.apiUrl}/*`, ({request}) => {
      console.log('Catch-all handler:', request.method, request.url)
      return new HttpResponse(null, {status: 404})
    }));
  });
  afterAll(() => {
    console.log(server);
    server.close();
  });
  test('logged out user visiting /tasks, redirects to /login', () => {
    window.history.pushState({}, '', '/tasks');
    render(<App />);
    //screen.debug();
    expect(window.location.pathname).toEqual('/login');
    expect(screen.getByText(/Sign in/, {selector: 'h1'})).toBeInTheDocument();
  });
  test('logged in users visiting /tasks, displays /tasks', async () => {
    server.use(http.post(`${server.apiUrl}/auth/login`, ({request}) => {
      console.log('AuthHandler:', request.method, request.url)
      return new HttpResponse('a-jwt', {status: 200})
    }));
    await store.dispatch(login({name: 'user', password: 'password'}));
    window.history.pushState({}, '', '/tasks');
    render(<App />);
    expect(window.location.pathname).toEqual('/tasks');
    expect(screen.getByText(/Task manager/, {selector: '.MuiTypography-h6'})).toBeInTheDocument();
  });
  test('logged in user visiting /, gets redirected to /tasks/pending', async () => {
    // Given
    server.use(http.post(`${server.apiUrl}/auth/login`, () => new HttpResponse('a-jwt', {status: 200})));
    await store.dispatch(login({name: 'user', password: 'password'}));
    window.history.pushState({}, '', '/');
    // When
    render(<App />);
    // Then
    expect(await screen.findByText(/Task manager/, {selector: '.MuiTypography-h6'})).toBeInTheDocument();
    expect(window.location.pathname).toEqual('/tasks/pending');
  });
});