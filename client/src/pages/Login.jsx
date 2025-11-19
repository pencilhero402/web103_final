import React from 'react';       
import { Link } from 'react-router-dom';
import logout from '../App.jsx'

const Login = (props) => {
    const AUTH_URL = `${props.api_url}/auth/github`;

    return (
        <div className='Login'>
            <h1>SceneIt</h1>
            <center>
                <a href={AUTH_URL}>
                    <button className="headerBtn">
                        🔒 Login via Github
                    </button>
                    <button className="headerBtn" onClick={logout}>
                        Logout
                    </button>
                </a>
            </center>
        </div>
    )
}

export default Login;