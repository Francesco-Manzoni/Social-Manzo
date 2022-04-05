import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import { deleteEducation } from '../../actions/profile';

const Education = ({ education, deleteEducation }) => {
  const educations = education.map((ed) => (
    <tr key={ed.eid}>
      <td>{ed.school}</td>
      <td className='hide-sm'>{ed.degree}</td>
      <td className='hide-sm'>
        <Moment format='DD/MM/YYYY'>{ed.from}</Moment> -{' '}
        {ed.to === null ? (
          ' Oggi'
        ) : (
          <Moment format='DD/MM/YYYY'>{ed.to}</Moment>
        )}
      </td>
      <td>
        <button
          onClick={() => deleteEducation(ed.eid)}
          className='btn btn-danger'
        >
          Cancella
        </button>
      </td>
    </tr>
  ));
  return (
    <Fragment>
      <h2 className='my-2'>Esperienze Scolastiche</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>Scuola</th>
            <th className='hide-sm'>Diploma</th>
            <th className='hide-sm'>Anni</th>
            <th />
          </tr>
        </thead>
        <tbody>{educations}</tbody>
      </table>
    </Fragment>
  );
};
Education.propTypes = {
  education: PropTypes.array.isRequired,
  deleteEducation: PropTypes.func.isRequired,
};

export default connect(null, { deleteEducation })(Education);
