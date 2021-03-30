import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

//connetto questo componente con redux per avere gli alert
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
import PropTypes from 'prop-types';

//per la registrazione
import { register } from '../../actions/auth';

const Register = ({ setAlert, register }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const { name, email, password, password2 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Password non corrispondono', 'danger'); //il secondo campo serve per i css
    } else {
      register({ name, email, password });
    }
  };

  return (
    <Fragment>
      <h1 className='large text-primary'>Registrati</h1>
      <p className='lead'>
        <i className='fas fa-user'></i>Crea il tuo profilo
      </p>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Nome'
            name='name'
            value={name}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email'
            name='email'
            value={email}
            onChange={(e) => onChange(e)}
            required
          />
          <small className='form-text'>
            Questo sito utilizza Gravatar, quindi se hai già una mail associata
            ad un profilo Gravatar usala{' '}
          </small>
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
        <div className='form-group'>
          <input
            type='password'
            placeholder='Reinserisci Password'
            minLength='8'
            name='password2'
            value={password2}
            onChange={(e) => onChange(e)}
          />
        </div>
        <input type='submit' value='Registrati' className='btn btn-primary' />
      </form>
      <p className='my-1'>
        Hai già un account? <Link to='/login'>Login</Link>
      </p>
    </Fragment>
  );
};

//dichiaro set alert qua così la possiamo chiamare dentro i props di Register
Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
};

export default connect(null, { setAlert, register })(Register);
