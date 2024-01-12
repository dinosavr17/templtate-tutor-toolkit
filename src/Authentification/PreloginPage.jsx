import React, { useRef, useState, useEffect } from 'react';
import tutor from "../asserts/images/teacher_prelogin.png";
import student from "../asserts/images/student_prelogin.png";
import appLogo from '../asserts/images/Logo.png'
import {
    MainWrapper,
    PaginationWrapper,
    StyledStepper,
    MainHeader,
    AuthorizationWrapper,
    LogoWrapper,
    RegistrationCard,
    RegistrationImageBlock,
    RegistrationFormWrapper,
    RegistrationLabel,
    RegistrationForm,
    RegisterButton,
    StatusOverlay,
    StatusContainer,
} from './Register';
import styled from "styled-components";
import {Button, Stepper} from "@mui/material";
// const MainWrapper = styled.div`
//   display: flex;
//   flex-direction: column;
// `;
export const PrelogoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  & > img {
    width: 50px;
    margin-right: 20px;
  }
  & > span {
    margin-left: 10px;
    color: #151632;
    text-align: center;
    //font-family: Bryndan Write;
    @media (min-width: 320px) {
      font-size: 20px;
    }
    font-size: 20px;
    font-style: normal;
    font-weight: 300;
    //line-height: 80%; /* 94.15px */
  }
`;

const PreloginWrapper = styled.div`
  width: 100vw;
  height: 100%;
`;

const PreloginBlock = styled.div `
    display: flex;
  flex-direction: column;
  justify-content: center;
`;
const PreloginTitle = styled.div`
  color: white;
  //font-weight: bold;
  display: flex;
  //width: 100%;
 justify-content: center;
  font-size: 28px;
  margin: 20px 0;
  //font-family: Bryndan Write;
`;

export const PreloginCard = styled.div`
  display: flex;
  //grid-template-columns: 0.45fr 1fr;
  flex-direction: row;
  justify-content: center;
  //background-color: #f5f5f5;
  //border-radius: 10px;
  //box-shadow: rgb(0 0 0 / 9%) 0px 9px 12px, rgb(0 0 0 / 6%) 0px 6px 6px;
  cursor: pointer;
  //margin: 0 100px;
  max-width: 100%;
  overflow: hidden;
  @media (min-width: 320px) {
    margin: 20px 40px 60px 40px;
  }
  @media (min-width: 768px) {
    margin: 20px 80px 80px 80px;
  }
  @media (min-width: 1024px) {
    margin: 20px 120px 100px 120px;
  }
  @media (min-width: 1440px) {
    margin: 20px 160px 100px 120px;
  }
`;
export const PreloginImageBlock = styled.div`
  //@media (min-width: 320px) {
  //  & > img {
  //    display: none;
  //  }
  //}
  //border-radius: 10px;
  //box-shadow: rgb(0 0 0 / 9%) 0px 9px 12px, rgb(0 0 0 / 6%) 0px 6px 6px;
  @media (min-width: 320px) {
    & > img, div {
      width: 250px;
      //height: 300px;
      display: block;
    }
    & > img {
      max-width: 100%;
    }
  //  }
    @media (min-width: 1024px) {
      & > img, div {
        width: 300px;
      }
  }
  margin: 10px 40px;
  //width: 280px;
`;
const RoleBlock = styled.div`
display: flex;
  justify-content: center;
  flex-direction: column;
`;

const PreloginCaption = styled.div `
font-size: 18px;
  color: white;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  padding: 10px;
  & > button {
    border-radius: 10px;
    background-color: #4ab8f3;
    border: white dashed;
    box-shadow: rgb(0 0 0 / 9%) 0px 9px 12px, rgb(0 0 0 / 6%) 0px 6px 6px;
    padding: 10px;
    color: white;
  }
`


const Prelogin = () => {

    return (
        <PreloginWrapper>
            <PreloginBlock>
                <PrelogoWrapper>
                    <img src={appLogo}/>
                    <PreloginTitle>Зарегистрироваться</PreloginTitle>
                </PrelogoWrapper>
                <PreloginCard>
                    <RoleBlock>
                    <PreloginImageBlock>
                        <img src={student}/>
                    </PreloginImageBlock>
                    <PreloginCaption>
                        <button>Студент</button>
                    </PreloginCaption>
                    </RoleBlock>
                <RoleBlock>
                    <PreloginImageBlock>
                       <img src={tutor}/>
                    </PreloginImageBlock>
                    <PreloginCaption>
                        <button>Преподаватель</button></PreloginCaption>
                </RoleBlock>
                </PreloginCard>
            </PreloginBlock>
        </PreloginWrapper>

    )
}

export default Prelogin