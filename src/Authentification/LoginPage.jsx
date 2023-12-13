import { useRef, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
// import './login.css';
import axios from '../api/axios'

import { Link, useNavigate, useLocation } from 'react-router-dom';
// import registerLogo from '../images/logotype.png'

const Login = () => {
    const {setAuth,login} = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const emailRef = useRef();
    const errRef = useRef();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');

    // useEffect(() => {
    //     emailRef.current.focus();
    // }, [])
    //
    // useEffect(() => {
    //     setErrMsg('');
    // }, [email, password])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://158.160.18.51:8000/account/token/',
                JSON.stringify({ username, password }),
                {

                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': 'http://localhost:3000',
                    },
                    withCredentials: true
                }
            );
            // console.log(JSON.stringify(response?.data));
            // console.log(JSON.stringify(response));
            const accessToken = response?.data?.access;
            console.log('token', accessToken);
            localStorage.setItem("userData", JSON.stringify({
                accessToken: accessToken
            }))
            setAuth({username,password, accessToken});
            login(accessToken,username)
            setUsername('');
            setPassword('');
            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
                console.log(err);
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    return (
        <section className="register_section">
            <div className="register_logo">
                {/*<img style={{width:'150px', height: '150px'}} className="registerLogo" src={registerLogo} alt='logo'/>*/}
            </div>
            <div className="card">
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <h1 className="login_title">Войти в AuctionMaster</h1>
                <form className="login_form" onSubmit={handleSubmit}>
                    <input className='login_input'
                           type="text"
                           placeholder="Корпоративная почта"
                           id="username"
                           ref={emailRef}
                           autoComplete="off"
                           onChange={(e) => setUsername(e.target.value)}
                           value={username}
                           required
                    />

                    <input className="login_input"
                           placeholder="Пароль"
                           type="password"
                           id="password"
                           onChange={(e) => setPassword(e.target.value)}
                           value={password}
                           required
                    />
                    <button className="login_btn">Войти</button>
                </form>
                <p>
                    Нет аккаунта?<br />
                    <span className="line">
                            {/*put router link here*/}
                        <a href="sign-up">Зарегистрироваться</a>
                        </span>
                </p>
            </div>
        </section>
    )
}

export default Login