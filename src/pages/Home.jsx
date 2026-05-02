import { useState, useEffect, useParams } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './Home.css'
import axios from 'axios';
import useDebounce from '../hooks/useDebounce'
import { useAuth } from '../context/AuthContext';

export default function Home() {

  const navigate = useNavigate();
  const { token } = useAuth();

  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 500);

  const [sortBy, setSortBy] = useState('popular');

  const [availableTags, setAvailableTags] = useState([]);
	const [selectedTags, setSelectedTags] = useState([]);

	useEffect(()=>{
		const fetchTags = async () => {
			const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/characters/tags`);
			setAvailableTags(res.data.data);
      console.log(selectedTags);
		};
		fetchTags();
	}, []);

  useEffect(() => {
    const getCharacters = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/characters/`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { search: debouncedQuery, sort: sortBy, tags: selectedTags.join(',')}
          });
        setCharacters(res.data.data);
        console.log(res.data.data);
      } catch (error) {
        console.error(error);
       
      } finally {
        setLoading(false);
      }
    };
    getCharacters();
    console.log(selectedTags);
  }, [token, debouncedQuery, sortBy, selectedTags]);


  const handleLikeClick = async (e, characterId) => {
    e.stopPropagation();
    if (!token) {
      console.log('Login please');
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/characters/like`, {characterId: characterId}, { headers: { Authorization: `Bearer ${token}` }});
      console.log(response);
      const updatedCharacter = response.data.data;
      console.log(updatedCharacter);
      setCharacters((prevCharacters) => 
        prevCharacters.map((character) => 
          character._id === updatedCharacter._id ? updatedCharacter : character
        )
      );
    } catch (error) {
      console.error("Error liking character", error.response?.data?.error || error.message);
    }

  }

  const handleNavigate = async (e, characterId) => {
    e.stopPropagation();
    navigate(`/chat/${characterId}`);
  }

  const handleTagChange = (tagToToggle) => {
    setSelectedTags((prevTags) => {
      const hasTag = prevTags.includes(tagToToggle);
      if (hasTag) {
        return prevTags.filter((tag) => tag !== tagToToggle);
      } else {
        return [...prevTags, tagToToggle];
      }
    });
  };
  return (
    <>
      <header className='header'>
        <section className="form-section">
          <div className="header">
            <h2>Explore</h2>
          </div>
          <div className="custom-form">

          <div className="form-row">  
            <div className="form-group">
              <label htmlFor="tags">Search</label>
              <input
                type="text"
                id="search"
                name="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
              />
            </div>
            <div className="form-group">
              <form onChange={(e) => setSortBy(e.target.value)}>
              <label htmlFor="tags">Filter</label>
              <select id="tags" name="sortBy" value={sortBy} >
                <option value="oldest">Oldest</option>
                <option value="newest">Newest</option>
                <option value="popular">Popular</option>
                <option value="messageCount">Message Count</option>
              </select>
              </form>
            </div>
          </div>
          <br/>
      </div>
          <div>
            <label htmlFor="tags">Tags</label>
            {availableTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
          
            return (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagChange(tag)}
                className={`tag-pill ${isSelected && 'selected'}`}
              >
                {tag}
              </button>
            );
          })}
          </div>
        </section>
        </header>
        <section id="center">
          <div className="card-container">
            
            {loading ? (
              <div>Loading...</div>
            ) : (
              characters.map((card) => {
                return (
                  <div 
                  key={card._id} 
                  className="card"
                  onClick={(e) => (handleNavigate(e, card._id))}
                  >
                  <div className="card-title">{card.title}</div>
                  <div className="card-name">{card.name}</div> 
                  <div className="card-description">{card.description}</div>
                  <div className="card-bottom-row">
                    <div className="card-tags">{card.tags}</div>
                    <div className="card-like">
                      <div className="card-like-count">{card.likeCount}</div>
                      <button className="like-button" type="button" onClick={(e) => handleLikeClick(e, card._id)}>Like</button>
                    </div>
                  </div>
                </div>
                );
              })
            )}
          </div>
        </section>


        <section id="next-steps">
          <div id="docs">
            <svg className="icon" role="presentation" aria-hidden="true">
              <use href="/icons.svg#documentation-icon"></use>
            </svg>
            <h2>Documentation</h2>
            <p>Your questions, answered</p>
            <ul>
              <li>
                <a href="https://vite.dev/" target="_blank" rel="noreferrer">
                  <img className="logo" src={viteLogo} alt="" />
                  Explore Vite
                </a>
              </li>
              <li>
                <a href="https://react.dev/" target="_blank" rel="noreferrer">
                  <img className="button-icon" src={reactLogo} alt="" />
                  Learn more
                </a>
              </li>
            </ul>
          </div>
          <div id="social">
            <svg className="icon" role="presentation" aria-hidden="true">
              <use href="/icons.svg#social-icon"></use>
            </svg>
            <h2>Connect with us</h2>
            <p>Join the Vite community</p>
            <ul>
              <li>
                <a href="https://github.com/vitejs/vite" target="_blank" rel="noreferrer">
                  <svg className="button-icon" role="presentation" aria-hidden="true">
                    <use href="/icons.svg#github-icon"></use>
                  </svg>
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://chat.vite.dev/" target="_blank" rel="noreferrer">
                  <svg className="button-icon" role="presentation" aria-hidden="true">
                    <use href="/icons.svg#discord-icon"></use>
                  </svg>
                  Discord
                </a>
              </li>
              <li>
                <a href="https://x.com/vite_js" target="_blank" rel="noreferrer">
                  <svg className="button-icon" role="presentation" aria-hidden="true">
                    <use href="/icons.svg#x-icon"></use>
                  </svg>
                  X.com
                </a>
              </li>
              <li>
                <a href="https://bsky.app/profile/vite.dev" target="_blank" rel="noreferrer">
                  <svg className="button-icon" role="presentation" aria-hidden="true">
                    <use href="/icons.svg#bluesky-icon"></use>
                  </svg>
                  Bluesky
                </a>
              </li>
            </ul>
          </div>
        </section>

        <div className="ticks"></div>


        <div className="ticks"></div>
        <section id="spacer"></section>

    </>
  );
}