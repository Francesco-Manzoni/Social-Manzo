import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getPost } from '../../../actions/post';
import { connect } from 'react-redux';
import { Spinner } from '../../layout/Spinner';
import PostItem from '../PostItem';
import { Link } from 'react-router-dom';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

const Post = ({ getPost, post: { post, loading }, match }) => {
  useEffect(() => {
    getPost(match.params.id);
  }, [getPost, match.params.id]);

  return loading || post === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <Link to='/posts' className='btn'>
        Indietro
      </Link>
      <PostItem post={post} showActions={false} />

      <div className='comments'>
        <p>Commenti:</p>
        {post.comments.map((comment) => (
          <CommentItem key={comment.cid} comment={comment} postId={post.pid} />
        ))}
      </div>
      <CommentForm postId={post.pid} />
    </Fragment>
  );
};

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({ post: state.post });
export default connect(mapStateToProps, { getPost })(Post);
