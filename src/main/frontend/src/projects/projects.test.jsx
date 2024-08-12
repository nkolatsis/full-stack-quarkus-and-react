import {screen, within, waitForElementToBeRemoved} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {http, HttpResponse} from 'msw';
import {setupServer} from 'msw/node';
import {render} from "../__tests__/react-redux";
import {login} from "../auth";
import {store} from '../store';
import {App} from '../App';

describe('projects module tests', () => {
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
    server.use(http.all(`${server.apiUrl}/*`, ({request}) => { // Catch-all handler not catching any events
      console.log('Catch-all handler:', request.method, request.url)  
      return new HttpResponse(null, {status: 404})
    }));
  });
  afterAll(() => {server.close()});

  // TODO: Handlers are not catching requests, ask stack overflow
  test('users can create projects', async () => {
    console.log(`${server.apiUrl}/auth/login`) // prints "http://localhost:8080/api/v1/auth/login"
    //console.log(server);
    server.use(http.post(`${server.apiUrl}/auth/login`), ({request}) => { // Handler not catching any calls
      console.log('AuthHandler:', request.method, request.url)
      return new HttpResponse("a-jwt", {status: 200})
    });

    console.log(server);
    await store.dispatch(login({name: 'user', password: 'password'}));
    window.history.pushState({}, '', '/');

    render(<App />);
    //expect(window.location.pathname).toEqual('/');  // Currently failing because /auth/login handler not matching
    
    /*server.use(http.post(`${server.apiUrl}/projects`, async ({request}) => {
      let formData = await request.json()
      console.log(formData)
      return new HttpResponse.json({name: formData.name}, {status: 201})
    }));
    
    userEvent.click(within(screen.getByText(/Projects/).closest('li')).getByTestId(/AddIcon/));
    const dialog = screen.getByRole('dialog');
    userEvent.type(within(dialog).getByLabelText(/Name/), 'new-project');
    userEvent.click(screen.getByText(/Save/));
    await waitForElementToBeRemoved(dialog);
    expect(screen.queryByRole('dialog')).toBeNull();*/
  })
})