import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAppContext } from '../../../context/app/appContext';
import { useAlertContext } from '../../../context/alert/alertContext';

const Form = styled.form`
  display: flex;
  align-items: center;
  margin: 0 8px;
  width: 300px;

  #text {
    color: #c0c0c0;
    font-size: 16px;
    font-family: 'Roboto', sans-serif;
    background-color: #101010;
    border: none;
    border-radius: 3px 0 0 3px;
    width: 85%;
    padding: 8px;
  }

  #submit {
    color: #c0c0c0;
    font-size: 20px;
    background-color: #101010;
    border: none;
    border-left: 1px solid #181818;
    border-radius: 0 3px 3px 0;
    width: 15%;
    cursor: pointer;
    opacity: 0.7;
    :hover {
      opacity: 1;
    }
    :focus {
      opacity: 1;
    }
  }
`;

const initQuery = 'Wizeline Academy';

const Search = () => {
  const [text, setText] = useState(initQuery);
  const { getResultVideos } = useAppContext();
  const { setAlert } = useAlertContext();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    getResultVideos(initQuery);
  }, []);

  const onChange = (e) => {
    setText(e.target.value);
  };
  const onClick = () => {
    document.getElementById('text').select();
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (text !== '') {
      getResultVideos(text);
      document.getElementById('text').select();
      if (pathname !== '/') {
        navigate('/', { replace: false });
      }
    } else {
      setAlert('Enter a search text');
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <input
        id='text'
        type='text'
        name='text'
        placeholder='Search'
        value={text}
        onChange={onChange}
        onClick={onClick}
      />
      <input
        id='submit'
        type='submit'
        className='material-icons'
        value='search'
      />
    </Form>
  );
};

export default Search;
