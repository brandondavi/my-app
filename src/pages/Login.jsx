// Login.jsx
import { useState }	 from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { useAuth } from '../context/AuthContext';

export default function Login() {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const navigate = useNavigate();
	const { login } = useAuth();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');		

		try {
			const response = await axios.post('${import.meta.env.VITE_API_URL}/api/auth/login', 
				{email, password}
			);


			const token = response.data.token;
			const userData = response.data.data;

			login(token, userData);

			navigate('/');
		} catch (err) {
			setError(err.response?.data?.error || 'An error occurred during login');
		}


	}; 

	const handleForgotPassword = () => {
		navigate('/forgotpassword');
	};

	return (
		<div className="form-section">
			<h2 className="form-header">Login</h2>
			

			{error && <div className="error">{error}</div>}
			<form onSubmit={handleSubmit}>

				<div className='form-group'>
					<label style={{display: 'block', marginBottom: '0.5rem'}}>Email:</label>
					<input 
						type="email" 
						value={email} 
						onChange={(e) => setEmail(e.target.value)} 
						required
					/>
				</div>

				<div className='form-group'>
					<label>Password:</label>
					<input 
						type="password" 
						value={password} 
						onChange={(e) => setPassword(e.target.value)} 
						required
					/>
				</div>

				<button type="submit" className="submit-btn">
					Login
				</button>
			</form>
			<div>
				<h2>Don't have an account?</h2>
				<button onClick={() => navigate('/register')} className="sub-button-btn">
					Register
				</button>
			</div>
			<div>
				<button onClick={handleForgotPassword} style={{cursor: 'pointer'}}>Forgot Password?</button>
			</div>
		</div>
	);
}