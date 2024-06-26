import { useEffect, useState } from 'react';
import image from '../Images/live-chat_512px.png';
import { signIn } from '../api/auth';
import { toast, Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import getCookie from '../utils/cookie';
import { Backdrop, CircularProgress } from '@mui/material';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkLoggedIn = () => {
      const loggedIn = getCookie('at');
      // console.log(loggedIn);
      if (loggedIn?.length > 0) {
        navigate('/app/welcome');
      }
    };

    checkLoggedIn();
  }, []);

  const notify = (text) => {
    toast(`🦄 ${text}`, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
      transition: Bounce
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = { email: email, password: password };
      console.log(`req.body = ${JSON.stringify(formData)}`);
      setLoading(true);
      const response = await signIn(formData);
      if (response.statusCode === 200) {
        console.log('Login successful');
        notify(response.message);
        setLoading(false);
        setTimeout(() => navigate('/app/welcome'), 5000);
      } else {
        console.error('Login failed: ', response.message);
        notify(response.message);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='w-[90vw] h-[90vh] bg-[#f4f5f8] rounded-[20px] flex'>
      <ToastContainer />
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        // onClick={handleClose}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
      {/* Image Container */}
      <div className='flex-[0.3] flex items-center justify-center'>
        <img src={image} alt='Live Chat' className='w-[80%]' />
      </div>
      {/* Login Box */}
      <form className='flex flex-[0.7] flex-col items-center justify-center gap-[20px] bg-[#fff] rounded-[20px] m-[10px] shadow'>
        <p className='text-[2rem] font-semibold'>Sign in to your account</p>
        <input
          onChange={(e) => setEmail(e.target.value)}
          type='text'
          placeholder='Email'
          className='outline-none w-[24rem] border-none pl-[20px] bg-[#f4f5f8] py-3 text-[1.25rem] rounded-[20px]'
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          type='password'
          placeholder='Password'
          className='outline-none w-[24rem] border-none pl-[20px] bg-[#f4f5f8] py-3 text-[1.25rem] rounded-[20px]'
        />
        <button
          onClick={handleSubmit}
          className='bg-black text-white px-8 py-2 rounded-[10px] hover:rounded-[20px] shadow-lg hover:bg-stone-700 duration-200 hover:shadow-sm font-semibold text-[1.2rem]'
        >
          Sign in
        </button>
        <p>
          Don&apos;t have an account?{' '}
          <span
            onClick={() => navigate('/register')}
            className='text-green-700 font-semibold hover:underline hover:underline-offset-4 cursor-pointer'
          >
            Create one now
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
