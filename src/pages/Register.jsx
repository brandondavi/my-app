// Register.jsx
import { useState }	 from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
	const [name, setName] = useState('');
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');

	const navigate = useNavigate();

	const includesNumber = /\d/.test(password);
	const includesSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
	const includesUppercase = /[A-Z]/.test(password);
	const includesLowercase = /[a-z]/.test(password);
	const isLongEnough = password.length >= 8;
	const passwordsMatch = password === confirmPassword;
	const isPasswordStrong = includesNumber && includesSpecialChar && includesUppercase && includesLowercase && isLongEnough;

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');


		if (!isPasswordStrong) {
			setError('Password is too weak');
			return;
		}

		if (!passwordsMatch) {
			setError('Passwords do not match');
			return;
		}
		
		try {
			
			await axios.post('/api/auth/register', {
						name,
						username,
						email,
						password
			}); 

			navigate('/verify', {state: {email: email}});

		} catch (err) {

			setError(err.response?.data?.error || 'An error occurred during registration');
		}
	};
	
	// handleEmail
	return (
		<div className="form-section">
			<h1>Register</h1>
			{error && <div style={{color: 'red'}}>{error}</div>}


			<form onSubmit={handleSubmit}>	
				<div className="form-group">
					<label>Name</label>
					<input
						type="name"
						value={name}
						placeholder=''
						onChange={(e) => {setName(e.target.value)}}
						required
						style={{ width: '100%', padding: '0.5rem' }}
					/>
				</div>
				<div className="form-group">
					<label>Username</label>
					<input
						type="username"
						value={username}
						placeholder=''
						onChange={(e) => {setUsername(e.target.value)}}
						required
						style={{ width: '100%', padding: '0.5rem' }}
					/>
				</div>
				<div className="form-group">
					<label>Email</label>
					<input
						type="email"
						value={email}
						placeholder='email@address.com'
						onChange={(e) => {setEmail(e.target.value)}}
						required
						style={{ width: '100%', padding: '0.5rem' }}
					/>
				</div>
				
				<div className="form-group">
					<label>Password</label>
					<input
						type="password"
						value={password}
						placeholder='Strong password'
						onChange={(e) => {setPassword(e.target.value)}}
						required
						style={{ width: '100%', padding: '0.5rem' }}
					/>
				</div>
				<br />
				<div className="form-group">
					<ul>
						<li>
							{isLongEnough ? '✅' : '❌'} At least 8 characters
						</li>
						<li>
							{includesUppercase ? '✅' : '❌'} At least one uppercase letter
						</li>
						<li>
							{includesLowercase ? '✅' : '❌'} At least one lowercase letter
						</li>
						<li>
							{includesNumber ? '✅' : '❌'} At least one number
						</li>
						<li>
							{includesSpecialChar ? '✅' : '❌'} At least one special character
						</li>

					</ul>
				</div>
				<div className="form-group">
					<label>Confirm Password</label>
					<input
						type="password"
						value={confirmPassword}
						placeholder='Confirm your password'
						onChange={(e) => {setConfirmPassword(e.target.value)}}
						required
						style={{ width: '100%', padding: '0.5rem' }}
					/>
				</div>
				<br />
				<div>
					<ul>
						<li>
							{passwordsMatch ? '✅' : '❌'} Passwords match
						</li>
					</ul>
				</div>
				<div className="form-group">
					<button 
						className="submit-btn"		
						type='submit' 
						onClick={handleSubmit} style={{ padding: '0.75rem', cursor: 'pointer', marginTop: '1rem'}}>
						Create Account
					</button>
				</div>
				
			</form>
			
		</div>
	);
}