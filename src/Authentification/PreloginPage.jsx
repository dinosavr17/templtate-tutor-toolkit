import React, { useRef, useState, useEffect } from 'react';
import tutor from "../asserts/images/teacher_prelogin.png";
import student from "../asserts/images/student_prelogin.png";
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


const PreloginWrapper = styled.div`
  width: 100vw;
  height: 100%;
`;
const PreloginTitle = styled.div`
  color: white;
  font-weight: bold;
  display: flex;
  
`;

export const PreloginCard = styled.div`
  display: flex;
  //grid-template-columns: 0.45fr 1fr;
  flex-direction: row;
  //background-color: #f5f5f5;
  //border-radius: 10px;
  //box-shadow: rgb(0 0 0 / 9%) 0px 9px 12px, rgb(0 0 0 / 6%) 0px 6px 6px;
  cursor: pointer;
  margin: 80px;
  max-width: 100%;
  overflow: hidden;
  //@media (min-width: 320px) {
  //  margin: 20px 40px 60px 40px;
  //  grid-template-columns: 1fr 1fr;
  //}
  //@media (min-width: 768px) {
  //  margin: 20px 80px 80px 80px;
  //  grid-template-columns: 1fr 1fr;
  //}
  //@media (min-width: 1024px) {
  //  margin: 20px 120px 100px 120px;
  //}
  //@media (min-width: 1440px) {
  //  margin: 20px 160px 100px 120px;
  //}
`;
export const PreloginImageBlock = styled.div`
  //@media (min-width: 320px) {
  //  & > img {
  //    display: none;
  //  }
  //}
  border-radius: 10px;
  box-shadow: rgb(0 0 0 / 9%) 0px 9px 12px, rgb(0 0 0 / 6%) 0px 6px 6px;
  @media (min-width: 320px) {
    & > img, div {
      width: 280px;
      display: block;
    }
  //  }
  //  @media (min-width: 1024px) {
  //    & > img, div {
  //      width: 300px;
  //    }
  //}
  margin: 20px 40px;
  //width: 280px;
`;

// export const RegistrationImageBlock = styled.div`
//   @media (min-width: 320px) {
//     & > img {
//       display: none;
//     }
//   }
//   @media (min-width: 660px) {
//     & > img, div {
//       width: 350px;
//       display: block;
//       margin-top: 50px;
//     }
//     }
//     @media (min-width: 1024px) {
//       & > img, div {
//         width: 450px;
//       }
//   }
// `;
// export const RegistrationFormWrapper = styled.div`
//   display: flex;
//   flex-direction: column;
//   overflow: visible;
//   background-color: white;
// `;
// const RegisterButton = styled(Button)`
//   border-radius: 10px;
//   border: solid #151632 1px;
// ` ;


const Prelogin = () => {


    return (
        <PreloginWrapper>
            <MainWrapper>
                <PreloginCard>
                    <PreloginTitle>Войти</PreloginTitle>
                    <PreloginImageBlock>
                        <span>Войти как студент</span>
                        <img src={student}/>
                    </PreloginImageBlock>
                    <PreloginImageBlock>
                        <span>Войти как преподаватель</span>
                       <img src={tutor}/>
                    </PreloginImageBlock>
                </PreloginCard>
            </MainWrapper>
        </PreloginWrapper>

    )
}

export default Prelogin