import React from 'react';
import ReactDOM from 'react-dom/client';
import App from 'src/App';
import * as serviceWorker from 'src/serviceWorker';

import { Provider } from 'react-redux';
import { makestore } from 'src/redux/store';
import { BrowserRouter } from 'react-router-dom';

// import { Authenticate } from 'src/pages/auth/components';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={makestore()}>
    <React.Fragment>
      <BrowserRouter>
        {/* <Authenticate /> */}
        <App />
      </BrowserRouter>
    </React.Fragment>
  </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
