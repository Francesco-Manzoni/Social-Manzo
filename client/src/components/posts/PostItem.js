import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { addLike, removeLike, deletePost } from '../../actions/post';

const PostItem = ({
  addLike,
  removeLike,
  deletePost,
  auth,
  post: { pid, text, name, avatar, user, likes, comments, date },
  showActions,
}) => (
  <div className='post bg-white my-1 p-1'>
    <div>
      <Link to={`/profile/${user}`}>
        <img className='round-img' src={avatar} alt='' />
        <h4>{name}</h4>
      </Link>
    </div>
    <div>
      <p className='my-1'>{text}</p>
      {showActions && (
        <Fragment>
          <button onClick={(a) => addLike(pid)} className='btn'>
            <i className='fas fa-thumbs-up'></i>{' '}
            {likes.length > 0 && (
              <span className='likes-count'>{likes.length}</span>
            )}
          </button>
          <button onClick={(a) => removeLike(pid)} className='btn'>
            <i className='fas fa-thumbs-down'></i>
          </button>
          <Link to={`/posts/${pid}`} className='btn btn-light'>
            Commenti{' '}
            {comments.length > 0 && (
              <span className='comment-count'>{comments.length}</span>
            )}
          </Link>
          {!auth.loading && user === auth.user.uid && (
            <button
              onClick={(e) => deletePost(pid)}
              type='button'
              className='btn btn-danger'
            >
              <i className='fas fa-times'></i>
            </button>
          )}
        </Fragment>
      )}

      <small className='post-date'>
        Creato il <Moment format='DD/MM/YYYY'>{date}</Moment>
      </small>
    </div>
  </div>
);

PostItem.defaultProps = {
  showActions: true,
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { addLike, removeLike, deletePost })(
  PostItem
);
