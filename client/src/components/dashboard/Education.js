/* import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import { deleteEducation } from '../../actions/profile';

const Education = ({ education, deleteEducation }) => {

    const educations = education.map((ed) => (
      <tr key={ed._id}>
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
            onClick={() => deleteEducation(ed._id)}
            className='btn btn-danger'
          >
            Cancella
          </button>
        </td>
      </tr>
    ));
    return (
      <Fragment>
        <h2 className='my-2'> Educazione</h2>
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

export default connect(null, { deleteEducation })(Education); */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteEducation } from '../../actions/profile';

function formatDate(date) {
  return new Intl.DateTimeFormat().format(new Date(date));
}

const Education = ({ education, deleteEducation }) => {
  const educations = education.map((edu) => (
    <tr key={edu._id}>
      <td>{edu.school}</td>
      <td className='hide-sm'>{edu.degree}</td>
      <td>
        {formatDate(edu.from)} - {edu.to ? formatDate(edu.to) : 'Now'}
      </td>
      <td>
        <button
          onClick={() => deleteEducation(edu._id)}
          className='btn btn-danger'
        >
          Delete
        </button>
      </td>
    </tr>
  ));

  return (
    <Fragment>
      <h2 className='my-2'>Education Credentials</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>School</th>
            <th className='hide-sm'>Degree</th>
            <th className='hide-sm'>Years</th>
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
