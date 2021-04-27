import React, { Fragment, useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createProfile, getCurrentProfile } from '../../actions/profile';

const EditProfile = ({
  profile: { profile, loading },
  createProfile,
  getCurrentProfile,
  history,
}) => {
  const [formData, setFormData] = useState({
    company: '',
    website: '',
    location: '',
    status: '',
    skills: '',
    githubusername: '',
    bio: '',
    twitter: '',
    facebook: '',
    linkedin: '',
    youtube: '',
    instagram: '',
  });

  const [displaySocials, toggleSocial] = useState(false); //Serve per nascondere/mostrare form dei social

  //serve per precaricare i campi in automatico

  useEffect(() => {
    if (!profile) getCurrentProfile();
    if (!loading && profile) {
      const profileData = { ...formData };
      for (const key in profile) {
        if (key in profileData) profileData[key] = profile[key];
      }
      for (const key in profile.social) {
        if (key in profileData) profileData[key] = profile.social[key];
      }
      if (Array.isArray(profileData.skills))
        profileData.skills = profileData.skills.join(', ');
      setFormData(profileData);
    } // eslint-disable-next-line
  }, [loading, getCurrentProfile, profile]);

  const {
    company,
    website,
    location,
    status,
    skills,
    githubusername,
    bio,
    twitter,
    facebook,
    linkedin,
    youtube,
    instagram,
  } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    createProfile(formData, history, true);
  };
  return (
    <Fragment>
      <h1 className='large text-primary'>Crea il tuo profilo</h1>
      <p className='lead'>
        <i className='fas fa-user'>Inserisci alcune informazioni su di te</i>
      </p>
      <small>* = Campi obbligatori</small>
      <form className='form' onSubmit={(event) => onSubmit(event)}>
        <div className='form-group'>
          <select
            name='status'
            value={status}
            onChange={(event) => onChange(event)}
          >
            <option value='0'>* Seleziona posizione lavorativa</option>
            <option value='Developer'>Developer</option>
            <option value='Junior Developer'>Junior Developer</option>
            <option value='Senior Developer'>Senior Developer</option>
            <option value='Manager'>Manager</option>
            <option value='Studente'>Studente</option>
            <option value='Insegnante'>Insegnante</option>
            <option value='Altro'>Altro</option>
          </select>
          <small className='form-text'>
            Dacci un'idea di dove ti trovi nella tua carriera
          </small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Azienda'
            name='company'
            value={company}
            onChange={(event) => onChange(event)}
          />
          <small className='form-text'>
            Potrebbe essere la tua azienda o quella per cui lavori
          </small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Website'
            name='website'
            value={website}
            onChange={(event) => onChange(event)}
          />
          <small className='form-text'>
            Può essere il tuo sito web o quello aziendale
          </small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Città'
            name='location'
            value={location}
            onChange={(event) => onChange(event)}
          />
          <small className='form-text'>Città e provincia</small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='* Skills'
            name='skills'
            value={skills}
            onChange={(event) => onChange(event)}
          />
          <small className='form-text'>
            Per favore separali con la virgola (es. HTML,CSS,JavaScript,PHP)
          </small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Github Username'
            name='githubusername'
            value={githubusername}
            onChange={(event) => onChange(event)}
          />
          <small className='form-text'>
            Se desideri mostrare le tue repository e un collegamento Github,
            includi il tuo nome utente
          </small>
        </div>
        <div className='form-group'>
          <textarea
            placeholder='Qualcosa su di te'
            name='bio'
            value={bio}
            onChange={(event) => onChange(event)}
          ></textarea>
          <small className='form-text'>Raccontaci qualcosa su di te.</small>
        </div>

        <div className='my-2'>
          <button
            onClick={() => toggleSocial(!displaySocials)}
            type='button'
            className='btn btn-light'
          >
            Aggiungi Social Networks
          </button>
          <span>Opzionale</span>
        </div>
        {displaySocials && (
          <Fragment>
            <div className='form-group social-input'>
              <i className='fab fa-twitter fa-2x'></i>
              <input
                type='text'
                placeholder='Twitter URL'
                name='twitter'
                value={twitter}
                onChange={(event) => onChange(event)}
              />
            </div>

            <div className='form-group social-input'>
              <i className='fab fa-facebook fa-2x'></i>
              <input
                type='text'
                placeholder='Facebook URL'
                name='facebook'
                value={facebook}
                onChange={(event) => onChange(event)}
              />
            </div>

            <div className='form-group social-input'>
              <i className='fab fa-youtube fa-2x'></i>
              <input
                type='text'
                placeholder='YouTube URL'
                name='youtube'
                value={youtube}
                onChange={(event) => onChange(event)}
              />
            </div>

            <div className='form-group social-input'>
              <i className='fab fa-linkedin fa-2x'></i>
              <input
                type='text'
                placeholder='Linkedin URL'
                name='linkedin'
                value={linkedin}
                onChange={(event) => onChange(event)}
              />
            </div>

            <div className='form-group social-input'>
              <i className='fab fa-instagram fa-2x'></i>
              <input
                type='text'
                placeholder='Instagram URL'
                name='instagram'
                value={instagram}
                onChange={(event) => onChange(event)}
              />
            </div>
          </Fragment>
        )}

        <input type='submit' className='btn btn-primary my-1' />
        <Link className='btn btn-light my-1' to='/dashboard'>
          Indietro
        </Link>
      </form>
    </Fragment>
  );
};

EditProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});
export default connect(mapStateToProps, { createProfile, getCurrentProfile })(
  withRouter(EditProfile)
); //withRouter serve per passare il parametro history
