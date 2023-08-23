import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './register.scss';
import { makeRequest } from '../../axios';
import { message } from 'antd';

const Register = () => {
  const [inputs, setInputs] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
  });
  const [messageApi, contextHolder] = message.useMessage();
  const success = msg => {
    messageApi.open({
      type: 'success',
      content: msg,
    });
  };
  const error = err => {
    messageApi.open({
      type: 'error',
      content: err,
    });
  };

  const handleChange = e => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const navigate = useNavigate();
  const handleClick = async e => {
    e.preventDefault();

    try {
      const res = await makeRequest.post('/auth/register', inputs);
      success(res.data);
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err) {
      error(err.response.data);
    }
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Bocchi Social.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>注册</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Name"
              name="name"
              onChange={handleChange}
            />
            {contextHolder}
            <button onClick={handleClick}>注册</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
