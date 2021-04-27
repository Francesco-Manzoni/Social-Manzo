import React, { Fragment } from 'react';
import spinner from './Double Ring-1s-200px.gif';

export const Spinner = () => (
  <Fragment>
    <img
      src={spinner}
      style={{ width: '200px', margin: 'auto', display: 'block' }}
      alt='Caricamento...'
    />
  </Fragment>
);
