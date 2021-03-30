import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to='/'>
          <i className='fas fa-people-arrows'></i> Manzedin
        </Link>
      </h1>
      <ul>
        <li>
          <Link to='!#'>Utenti</Link>
        </li>
        <li>
          <Link to='/register'>Registrati</Link>
        </li>
        <li>
          <Link to='/login'>Login</Link>
        </li>
      </ul>
    </nav>
  );
};
