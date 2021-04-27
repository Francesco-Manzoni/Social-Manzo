import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createPost } from '../../actions/post';

const PostCreate = ({ createPost }) => {
  const [text, setText] = useState('');

  return (
    <div className='post-form'>
      {/* <div className='bg-white p'>
        <h3> Scrivi qualcosa..</h3>
      </div> */}
      <form
        className='form my-1'
        onSubmit={(e) => {
          e.preventDefault();
          createPost({ text });
          setText('');
        }}
      >
        <textarea
          name='text'
          cols='30'
          rows='5'
          placeholder='Scrivi qualcosa...'
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        ></textarea>
        <input type='submit' className='btn btn-dark my-1' value='Invia' />
      </form>
    </div>
  );
};

PostCreate.propTypes = {
  createPost: PropTypes.func.isRequired,
};

export default connect(null, { createPost })(PostCreate);
