import React from 'react';

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
            <a href='register.html' className='btn btn-primary'>
              Registrati
            </a>
            <a href='login.html' className='btn btn'>
              Login
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
