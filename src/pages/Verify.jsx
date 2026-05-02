import { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { useAuth } from '../context/AuthContext';


export default function Verify() {

	const [code, setCode] = useState(['', '', '', '', '', '']);
	const [error, setError] = useState('');
	
    const { login } = useAuth();
	

	const location = useLocation();
	const email = location.state?.email;
	

	const navigate = useNavigate();
	

	const inputRefs = useRef([]);	
	

	
	const handleChange = (index, e) => {
		const value = e.target.value;
		
		if (isNaN(value)) return;
		
		const newCode = [...code];

		newCode[index] = value.substring(value.length - 1);
		setCode(newCode);
		

		if (value && index < 5) {
			inputRefs.current[index + 1].focus();
		}
	};

	const handleKeyDown = (index, e) => {

		if (e.key === 'Backspace' && !code[index] && index > 0) {
			inputRefs.current[index - 1].focus();
		}
	};
	
	const handlePaste = (e) => {
		e.preventDefault();
		const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
		

		if (pastedData.some(char => isNaN(char))) return;
		
		const newCode = [...code];
		pastedData.forEach((char, i) => {
			newCode[i] = char;
			

			if (inputRefs.current[i]) inputRefs.current[i].focus();
		});
		setCode(newCode);
	};
	

	
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');

		const fullPasskey = code.join('');
		if (fullPasskey.length !== 6) {
			setError("Please enter all 6 digits.");
			return;
		}
		
		try {
			const response = await axios.post('/api/auth/verify', {
				email,
				passkey: fullPasskey
			});
			

			const token = response.data.token;
			const userData = response.data.data;
			
            login(token, userData);
			navigate('/');
	
		} catch (error) {
			setError(error.response?.data?.error || "Invalid varification code");
		}
	};
	
	if (!email) {
		return <div style={{ padding: '2rem' }}>Error: No email provided. Please register first.</div>;
	}
	
	return (
		<div className="form-section">
			<h2>Check your Email</h2>
			<p>We sent a 6-digit code to <strong>{email}</strong></p>
			
			{error && <div className="error">{error}</div>}
			<form onSubmit={handleSubmit}>
				<div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem'}}>
					{code.map((data, index) => (
						<input
							key={index}
							type="text"
							maxLength="1"
							ref={(el) => (inputRefs.current[index] = el)}
							value={data}
							onChange={(e) => handleChange(index, e)}
							onKeyDown={(e) => handleKeyDown(index, e)}
							onPaste={handlePaste}
							style={{
								width: '40px',
								height: '50px',
								fontSize: '1.5rem',
								textAlign: 'center',
								borderRadius: '8px',
								border: '1px solid #282626'
							}}
						/>
					))}
				</div>
				
				<button type="submit" className="submit-btn">
					Verify Account
				</button>
			</form>
		</div>
	);
}