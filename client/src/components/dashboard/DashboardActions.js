import React from 'react';
import { Link } from 'react-router-dom';

const DashboardActions = () => {
  return (
    <div>
      <div className='dash-buttons'>
        <Link to='/edit-profile' className='btn'>
          <i className='fas fa-user-circle text-primpary'></i> Modifica profilo
        </Link>

        <Link to='/add-experience' className='btn'>
          <i className='fab fa-black-tie text-primpary'></i> Aggiungi Esperienza
        </Link>

        <Link to='/add-education' className='btn'>
          <i className='fas fa-graduation-cap text-primpary'></i> Aggiungi
          educazione
        </Link>
      </div>
    </div>
  );
};

export default DashboardActions;
