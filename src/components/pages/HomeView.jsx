import React from 'react';
import VideoList from '../VideoList/VideoList';
import { useAppContext } from '../../context/app/appContext';
import styled from 'styled-components';

const StyledContainer = styled.div`
  padding-top: 99px;
`;

const HomeView = () => {
  const { resultVideos } = useAppContext();
  return (
    <StyledContainer>
      <VideoList videos={resultVideos} />
    </StyledContainer>
  );
};

export default HomeView;
