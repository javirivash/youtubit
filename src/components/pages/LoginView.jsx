import React, { useState } from 'react';
import { useAppContext } from '../../context/app/appContext';
import styled from 'styled-components';

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${(props) => props.theme.dialog};
  border-radius: 5px;
  height: 400px;
  width: 360px;
  padding: 25px;
  * {
    color: ${(props) => props.theme.primaryText};
    border-radius: 3px;
    border: none;
  }
  *:focus {
    outline: solid 1px #c0c0c0;
  }
`;
const StyledExit = styled.button`
  align-self: flex-start;
  font-size: 14px;
  background: none;
  cursor: pointer;
`;
const StyledFlex = styled.div`
  display: flex;
  justify-content: space-between;
`;
const StyledHeader = styled.h1`
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  text-align: center;
  margin-bottom: 20px;
`;
const StyledInput = styled.input`
  display: block;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  color: #505050;
  border: 1px solid #d0d0d0;
  width: 100%;
  margin-bottom: 20px;
  padding: 9px;
`;
const StyledSignup = styled.button`
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  color: #101010;
  width: 100%;
  padding: 10px;
  background-color: #4ac95f;
  border: none;
  cursor: pointer;
  :hover {
    background-color: #3ba04c;
  }
`;
const StyledLogin = styled.button`
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  color: #101010;
  width: 100%;
  padding: 10px;
  background-color: #417dd2;
  cursor: pointer;
  :hover {
    background-color: #3464a8;
  }
`;
const StyledReturn = styled.button`
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  padding-right: 8px;
  opacity: 0.6;
  background: none;
  height: 25px;
  cursor: pointer;
  :hover {
    opacity: 1;
  }
  span {
    font-size: 18px;
    vertical-align: middle;
  }
`;

const LoginView = () => {
  const [shouldShowSignup, setShouldShowSignup] = useState(true);
  const [emailText, setEmailText] = useState('');
  const [passwordText, setPasswordText] = useState('');
  const { deactivateLogin, signUpUser, logInUser } = useAppContext();

  const onPasswordChange = (e) => setPasswordText(e.target.value);
  const onEmailChange = (e) => setEmailText(e.target.value);

  const toggleForm = () => {
    setShouldShowSignup(!shouldShowSignup);
    setEmailText('');
    setPasswordText('');
  };

  const handleSignup = (e) => {
    e.preventDefault();
    signUpUser(emailText.trim(), passwordText);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    logInUser(emailText.trim(), passwordText);
  };

  return shouldShowSignup ? (
    <StyledForm onSubmit={handleSignup}>
      <StyledFlex>
        <span className='material-icons'>verified_user</span>
        <StyledExit
          type='button'
          onClick={deactivateLogin}
          className='material-icons'
        >
          close
        </StyledExit>
      </StyledFlex>
      <div>
        <StyledHeader>Enter a new email and password</StyledHeader>
        <StyledInput
          id='email'
          type='text'
          placeholder='Email'
          onChange={onEmailChange}
          value={emailText}
          autoFocus
        />
        <StyledInput
          id='password'
          type='password'
          placeholder='Password'
          onChange={onPasswordChange}
          value={passwordText}
        />
        <StyledSignup type='submit' id='signUp'>
          Sign up
        </StyledSignup>
      </div>
      <div>
        <StyledHeader>Already have an account?</StyledHeader>
        <StyledLogin onClick={toggleForm} type='button' id='logIn'>
          Log in
        </StyledLogin>
      </div>
    </StyledForm>
  ) : (
    <StyledForm onSubmit={handleLogin}>
      <StyledFlex>
        <span className='material-icons'>verified_user</span>
        <StyledExit
          type='button'
          onClick={deactivateLogin}
          className='material-icons'
        >
          close
        </StyledExit>
      </StyledFlex>
      <div>
        <StyledHeader>Enter your email and password</StyledHeader>
        <StyledInput
          id='email'
          type='text'
          placeholder='Email'
          onChange={onEmailChange}
          value={emailText}
        />
        <StyledInput
          id='password'
          type='password'
          placeholder='Password'
          onChange={onPasswordChange}
          value={passwordText}
        />
        <StyledLogin type='submit' id='logIn'>
          Log in
        </StyledLogin>
      </div>
      <div>
        <StyledReturn onClick={toggleForm}>
          <span className='material-icons'>keyboard_arrow_left</span>
          Sign up
        </StyledReturn>
      </div>
    </StyledForm>
  );
};

export default LoginView;
