import { useState }	 from 'react';
import axios from 'axios';
import './Home.css';

export default function ForgotPassword() {

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleSendEmail = async (e) => {
        e.preventDefault();
        setError('');
        try {
            setError('sending email...');
            console.log(email);
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/forgotpassword`, {email});
            console.log(response);

        } catch (err) {
            setError(err.response?.data?.error || 'Error sending email');
        }

    }

    return (
        <div className="form-section">
            {error && <div className="error">{error}</div>}
            <div ><h1>Forgot Password</h1></div>
            <form onSubmit={handleSendEmail} className="custom-form">
                
                <div className="form-group">
                    <div className="form-header"><label>Email</label></div>
                    <div><input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    /></div>
                    <div>
                        <button type="submit" className="submit-btn">
                        Send Reset Link
                        </button>
                    </div>
                </div>
            </form>
        </div>

    );

}