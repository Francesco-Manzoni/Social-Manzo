import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteComment } from '../../../actions/post';
import Moment from 'react-moment';

const CommentItem = ({
  postId,
  comment: { cid, pid, userid, text, name, avatar, date },
  auth,
}) => {
  return (
    <div className='post bg-white p-1 my-1'>
      <div>
        <Link to={`/profile/${userid}`}>
          <img className='round-img' src={avatar} alt='' />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className='my-1'>{text}</p>
        <p>
          <small className='post-date'>
            <Moment format='DD/MM/YYYY'>{date}</Moment>
          </small>
        </p>
        {!auth.loading && userid === auth.user.uid && (
          <button
            onClick={(e) => deleteComment(postId, cid)}
            type='button'
            className='btn btn-danger'
          >
            <i className='far fa-trash-alt'></i>
          </button>
        )}
      </div>
    </div>
  );
};

CommentItem.propTypes = {
  postId: PropTypes.string.isRequired,
  comment: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { deleteComment })(CommentItem);
