import React from 'react';

export const Navbar = () => {
  return (
    <nav className='navbar bg-dark'>
      <h1>
        <a href='dashboard.html'>
          <i className='fas fa-people-arrows'></i> Manzedin
        </a>
      </h1>
      <ul>
        <li>
          <a href='profiles.html'>Utenti</a>
        </li>
        <li>
          <a href='register.html'>Registrati</a>
        </li>
        <li>
          <a href='login.html'>Login</a>
        </li>
      </ul>
    </nav>
  );
};
