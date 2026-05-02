
// CreateCharacter.jsx
import { useState, useEffect } from 'react';
import './Home.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CreateCharacter() {

	const { token } = useAuth();
	const navigate = useNavigate();
	const [availableTags, setAvailableTags] = useState([]);
	
	useEffect(()=>{
		const fetchTags = async () => {
			const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/characters/tags`);
			setAvailableTags(res.data.data);

		};
		fetchTags();
	}, []);

	const [characterFormData, setCharacterFormData] = useState({
	title: '',
    name: '',
    description: '',
    systemPrompt: '',
    tags: [],
    isPrivate: false
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCharacterFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form payload:", characterFormData);
	try {
		console.log(token);
		await axios.post(`${import.meta.env.VITE_API_URL}/api/characters/create`, characterFormData, { headers: { Authorization: `Bearer ${token}` } });
	} catch (err) {
		setError(err.response?.data?.error || 'Could not send character details.');
		return;
	}
	navigate('/');
  };

  const handleTagChange = (tagToToggle) => {
    setCharacterFormData((prevData) => {
		const hasTag = prevData.tags.includes(tagToToggle);
		if (hasTag) {
			return { 
				...prevData, 
				tags: prevData.tags.filter((tag) => tag !== tagToToggle),
			};
		} else {
			return {
				...prevData, 
				tags: [...prevData.tags, tagToToggle],
			};
		}
	});  
	
  };

  return (
    <section id="formsection" className="form-section"> 
	<div className="header">
        <h2>Create Character</h2>
    </div>
      <form onSubmit={handleSubmit} className="custom-form">
		<div className="form-row">
			<div className="form-group">
			<label htmlFor="title">Title</label>
			<input
				type="text"
				id="title"
				name="title"
				value={characterFormData.title}
				onChange={handleChange}
				required
				placeholder="A helpful assistant"
			/>
			</div>
		</div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="Name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={characterFormData.name}
              onChange={handleChange}
              required
              placeholder="Joe"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            type="description"
            id="description"
            name="description"
            value={characterFormData.description}
            onChange={handleChange}
            required
			placeholder="Write a description"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="systemPrompt">System Prompt</label>
          <textarea
            id="systemPrompt"
            name="systemPrompt"
            value={characterFormData.systemPrompt}
            onChange={handleChange}
            rows="4"
            required
            placeholder="Write instructions for the AI"
          ></textarea>
        </div>

		<div className="form-tags-group">
			<label htmlFor="tags">Tags</label>
			{availableTags.map((tag) => {
				const isSelected = characterFormData.tags.includes(tag);
				
				return (
					<button
						key={tag}
						type="button"
						onClick={() => handleTagChange(tag)}
						className={`tag-pill ${isSelected ? 'selected' : ''}`}
						
					>
						{tag}
					</button>
				);
			})}
			
		</div>
		<div className="checkbox-group">
			<label htmlFor="isPrivate">Private</label>
			<input
				
				type="checkbox"
				id="isPrivate"
				name="isPrivate"
				checked={characterFormData.isPrivate}
				onChange={(e) => setCharacterFormData((prevData) => ({
					...prevData,
					isPrivate: e.target.checked,
				}))}
			/>
		</div>
        <button type="submit" className="submit-btn">
          Create Character
        </button>
      </form>
    </section>
  );
}