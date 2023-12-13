import { useRef, useState, useEffect, } from "react";
import axios from "../api/axios";
import styled from 'styled-components'

const RegistrationFormWrapper = styled.div`
  //flex-basis: 290px;
  display: flex;
  flex-direction: column;
  overflow: visible;
`;
const RegistrationForm = styled.form`
  //flex-basis: 290px;
  display: flex;
  flex-direction: column;
  overflow: visible;
`;
const RegistrationInput = styled.input`
margin-top: 10px;
` ;

const USER_REGEX = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;

const Register = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [password, setPassword] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidName(USER_REGEX.test(email));
    }, [email])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(password));
        setValidMatch(password === matchPwd);
    }, [password, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [email, password, matchPwd])

    const handleSubmit = async () => {
        try {
            const response = await axios.post('/account/register/',
                JSON.stringify({ email: email, password: password, role: 'tutor',
                    first_name: firstName, last_name: lastName}),
                {
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:3000' },
                    withCredentials: true
                }
            );
        } catch (err) {
            // if (!err?.response) {
            //     setErrMsg('No Server Response');
            // } else if (err.response?.status === 409) {
            //     setErrMsg('Username Taken');
            // } else {
            //     setErrMsg('Registration Failed')
            // }
            // errRef.current.focus();
        }
    }

    return (
        <>
            {success ? (
                <section>
                    <h1>Успешно!</h1>
                    <p>
                        <a href="sign-in">Войти</a>
                    </p>
                </section>
            ) : (
                <RegistrationFormWrapper>
                    <h1 className="register_title">Зарегистрироваться как преподаватель</h1>
                    <div className="card register_card">
                        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                        <RegistrationForm onSubmit={handleSubmit}>
                            <RegistrationInput
                                   type="text"
                                   id="username"
                                   placeholder="Корпоративная почта"
                                   ref={userRef}
                                   autoComplete="off"
                                   onChange={(e) => setEmail(e.target.value)}
                                   value={email}
                                   required
                                   aria-invalid={validName ? "false" : "true"}
                                   aria-describedby="uidnote"
                                   onFocus={() => setUserFocus(true)}
                                   onBlur={() => setUserFocus(false)}
                            />

                            <RegistrationInput
                                   type="password"
                                   id="password"
                                   placeholder="Пароль"
                                   onChange={(e) => setPassword(e.target.value)}
                                   value={password}
                                   required
                                   aria-invalid={validPwd ? "false" : "true"}
                                   aria-describedby="pwdnote"
                                   onFocus={() => setPwdFocus(true)}
                                   onBlur={() => setPwdFocus(false)}
                            />


                            <RegistrationInput
                                   type="password"
                                   id="confirm_pwd"
                                   placeholder="Подтвердить пароль"
                                   onChange={(e) => setMatchPwd(e.target.value)}
                                   value={matchPwd}
                                   required
                                   aria-invalid={validMatch ? "false" : "true"}
                                   aria-describedby="confirmnote"
                                   onFocus={() => setMatchFocus(true)}
                                   onBlur={() => setMatchFocus(false)}
                            />
                            <RegistrationInput
                                   type="text"
                                   id="name"
                                   placeholder="Имя"
                                   onChange={(e) => setFirstName(e.target.value)}
                                   value={firstName}
                                   required
                            />
                            <RegistrationInput
                                   type="text"
                                   id="surname"
                                   placeholder="Фамилия"
                                   onChange={(e) => setLastName(e.target.value)}
                                   value={lastName}
                                   required
                            />

                            <button className="register_btn">Зарегистрироваться</button>
                        </RegistrationForm>
                        <p>
                            Уже зарегистрированы?<br />
                            <span className="line">
                                <a href="sign-in">Войти</a>
                        </span>
                        </p>
                    </div>
                </RegistrationFormWrapper>
            )}
        </>

    )
}

export default Register