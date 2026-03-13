import React, { Fragment } from 'react';
import VideoItem from '../VideoItem/VideoItem';
import Spinner from '../layout/Spinner';
import { useAppContext } from '../../context/app/appContext';
import styled from 'styled-components';
import PropTypes from 'prop-types';

export const StyledTitle = styled.h1`
  font-family: 'Roboto', sans-serif;
  font-size: 24px;
  color: ${(props) => props.theme.primaryText};
  margin-bottom: 24px;
`;
const ItemsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin: auto;
  padding-left: 20px;

  @media only screen and (max-width: 530px) {
    padding-left: 0;
  }
`;

const VideoList = ({ listTitle, videos }) => {
  const { loading } = useAppContext();

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      {listTitle && <StyledTitle>{listTitle}</StyledTitle>}
      <ItemsContainer role='videoList'>
        {videos.map((item) => (
          <VideoItem key={item.id} video={item} />
        ))}
      </ItemsContainer>
    </Fragment>
  );
};

VideoList.propTypes = {
  listTitle: PropTypes.node,
  videos: PropTypes.array.isRequired,
};

export default VideoList;
