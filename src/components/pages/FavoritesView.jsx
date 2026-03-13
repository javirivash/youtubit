import React from 'react';
import { useAppContext } from '../../context/app/appContext';
import styled from 'styled-components';
import VideoList from '../VideoList/VideoList';

const StyledContainer = styled.div`
  padding-top: 99px;
`;

const FavoritesView = () => {
  const { currentFavorites } = useAppContext();

  return (
    <StyledContainer>
      <VideoList videos={currentFavorites} />
    </StyledContainer>
  );
};

export default FavoritesView;
