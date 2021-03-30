import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

export const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();

    console.log('FATTO');
  };

  return (
    <Fragment>
      <h1 className='large text-primary'>Login</h1>
      <p className='lead'>
        <i className='fas fa-user'></i>
        Loggati per vedere il tuo profilo
      </p>

      <form onSubmit={(e) => onSubmit(e)} className='form'>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email'
            name='email'
            value={email}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            minLength='8'
            value={password}
            onChange={(e) => onChange(e)}
          />
        </div>

        <input type='submit' value='Login' className='btn btn-primary' />
      </form>
      <p className='my-1'>
        Non hai un account? <Link to='/register'>Registrati</Link>
      </p>
    </Fragment>
  );
};
