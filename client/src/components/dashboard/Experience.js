import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import { deleteExperience } from '../../actions/profile';

const Experience = ({ experience, deleteExperience }) => {
  const experiences = experience.map((es) => (
    <tr key={es.eid}>
      <td>{es.company}</td>
      <td className='hide-sm'>{es.title}</td>
      <td className='hide-sm'>
        <Moment format='DD/MM/YYYY'>{es.from}</Moment> -{' '}
        {es.to === null ? (
          ' Oggi'
        ) : (
          <Moment format='DD/MM/YYYY'>{es.to}</Moment>
        )}
      </td>
      <td>
        <button
          onClick={() => deleteExperience(es.eid)}
          className='btn btn-danger'
        >
          Cancella
        </button>
      </td>
    </tr>
  ));
  return (
    <Fragment>
      <h2 className='my-2'> Esperienze Lavorative</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>Azienda</th>
            <th className='hide-sm'>Posizione</th>
            <th className='hide-sm'>Anni</th>
            <th />
          </tr>
        </thead>
        <tbody>{experiences}</tbody>
      </table>
    </Fragment>
  );
};

Experience.propTypes = {
  experience: PropTypes.array.isRequired,
  deleteExperience: PropTypes.func.isRequired,
};

export default connect(null, { deleteExperience })(Experience);
