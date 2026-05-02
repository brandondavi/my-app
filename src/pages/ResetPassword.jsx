import { useState }	 from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

import axios from 'axios';

export default function ResetPassword() {

    const { token: urlToken } = useParams();

    const { login } = useAuth();

    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');

	const navigate = useNavigate();

	const includesNumber = /\d/.test(newPassword);
	const includesSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
	const includesUppercase = /[A-Z]/.test(newPassword);
	const includesLowercase = /[a-z]/.test(newPassword);
	const isLongEnough = newPassword.length >= 8;
	const passwordsMatch = newPassword === confirmNewPassword;
	const isPasswordStrong = includesNumber && includesSpecialChar && includesUppercase && includesLowercase && isLongEnough;
	
    
	const handleSubmitPassword = async (e) => {
		e.preventDefault();
		setError('');

        console.log("handling password reset");
        
		if (!isPasswordStrong) {
			setError('Password is too weak');
			return;
		}
		if (!passwordsMatch) {
			setError('Passwords do not match');
			return;
		}
        
        console.log(newPassword);
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/resetpassword/${urlToken}`, {password: newPassword});

        const jwtToken = response.data.token;
        const userData = response.data.data;

        login(jwtToken, userData);

        console.log("Password reset successful");
        navigate('/');
    };
 
    return (
        <div>
			<h1>Change Password</h1>
			{error && <div style={{color: 'red'}}>{error}</div>}


			<form onSubmit={handleSubmitPassword} className="custom-form" className="form-section">	

				<div className="form-group">
					<label>New Password</label>
					<input
						type="password"
						value={newPassword}
						placeholder='Strong password'
						onChange={(e) => {setNewPassword(e.target.value)}}
						required
						
					/>
				</div>
				<br />
				<div>
					<ul className="form-group" style={{ 'textAlign': 'left', 'alignContent': 'center'}}>
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
						value={confirmNewPassword}
						placeholder='Confirm your password'
						onChange={(e) => {setConfirmNewPassword(e.target.value)}}
						required
					/>
				</div>
				<br />
				<div>
					<ul className="form-group" style={{ 'textAlign': 'left', 'alignContent': 'center'}}>
						<li>
							{passwordsMatch ? '✅' : '❌'} Passwords match
						</li>
					</ul>
				</div>
				<button 
					type='submit' 
                    className="submit-btn"
					onClick={handleSubmitPassword} style={{ padding: '0.75rem', cursor: 'pointer', marginTop: '1rem'}}>
					Reset Password
				</button>
			</form>
			
		</div>


    );
}