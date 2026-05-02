import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../pages/Home.css';


export default function Navbar() {

	const { user, logout } = useAuth();
	console.log(user);

	const navigate = useNavigate();
	
	const handleLogout = () => {
		logout();
		navigate('/');
	};
	
  return (
    <nav className="nav-bar">
      <div>
        <Link to="/" className="nav-text">
          Chat
        </Link>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/createcharacter">Create Character</Link>
        
          {user ? (
            <>
              <span style={{ fontStyle: 'Italic', color: 'gray' }}>Hi, {user.name}</span>
              <button onClick={handleLogout} style={{cursor: 'pointer'}}>Logout</button>
            </>
          ) : (
              <>
                <Link to="/login">Login</Link>
              </>
          )}
      </div>
    </nav>
  );
}