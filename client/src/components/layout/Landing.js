import React from 'react';
import { Link } from 'react-router-dom';

export const Landing = () => {
  return (
    <section className='landing'>
      <div className='dark-overlay'>
        <div className='landing-inner'>
          <h1 className='x-large'>Connettiti con il mondo!</h1>
          <p className='lead'>
            Crea il tuo profilo, condividi post e conosci nuove persone e
            opportunità.
          </p>
          <div className='buttons'>
            <Link to='/register' className='btn btn-primary'>
              Registrati
            </Link>
            <Link to='/login' className='btn btn'>
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
