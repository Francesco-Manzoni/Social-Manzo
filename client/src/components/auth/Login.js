import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';

const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();

    login(email, password);
  };

  //se ha loggato ridireziona
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }
  return (
    <Fragment>
      <h1 className='large text-primary'>Login</h1>
      <p className='lead'>
        <i className='fas fa-user'></i>
        Loggati per vedere il tuo profilo
      </p>

      <form onSubmit={(e) => onSubmit(e)} className='form' data-testid='form'>
        <div className='form-group'>
          <input
            data-testid='email'
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
            data-testid='password'
            type='password'
            placeholder='Password'
            name='password'
            minLength='8'
            value={password}
            onChange={(e) => onChange(e)}
          />
        </div>

        <input
          data-testid='LoginButton'
          type='submit'
          value='Login'
          className='btn btn-primary'
        />
      </form>
      <p className='my-1'>
        Non hai un account? <Link to='/register'>Registrati</Link>
      </p>
    </Fragment>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps, { login })(Login);
