import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Home.css';
import ReactMarkdown from 'react-markdown';
export default function Chat() {
	
	const { token } = useAuth();
	const { characterId } = useParams();

	const [conversationId, setConversationId] = useState(null);
	const [messages, setMessages] = useState([]);
	const [inputText, setInputText] = useState('');
	const [loading, setLoading] = useState(true);
	const messagesEndRef = useRef(null);
	const [character, setCharacter] = useState('');
	try {
		
	} catch (error) {
		console.error(error);
	}
 	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(()=>{
		const getcharacter = async () => {
			if (!token) {
				setLoading(false);
				return;
			}
			const characterResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/characters/${characterId}`, {headers: {Authorization: `Bearer ${token}`}});
			setCharacter(characterResponse.data.data);
			console.log(characterResponse.data.data);
		};
		getcharacter();
	}, [token, characterId]);
		
	useEffect(()=>{
		scrollToBottom();

	}, [messages]);

	useEffect(()=>{
		
		const initializeChat = async () => {
			if (!token || !characterId) return;
			try {
				// get or create the conversation
				const conversationResponse = await axios.post(
					`${import.meta.env.VITE_API_URL}/api/conversation/start`,
					{characterId}, 
					{headers: {Authorization: `Bearer ${token}`}}

				);

				const currentConversationId = conversationResponse.data.data._id;
				setConversationId(currentConversationId);
				console.log(`Conversation ID: ${currentConversationId}`);
				console.log(characterId);
				const messageResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/conversation/${currentConversationId}/messages`, 
					{ headers: {Authorization: `Bearer ${token}`}}
				);

				console.log(token);
				setMessages(messageResponse.data.data);
				console.log(messageResponse.data.data);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};
		initializeChat();
	}, [token, characterId]);
	
	
	const handleSendMessage = async (e) => {
		e.preventDefault();
		if (!inputText.trim() || !conversationId) return;

		const newUserMsg = {id: Date.now(), content: inputText, role: "user"};
		
		setMessages((prev) => [...prev, newUserMsg]);

		const textToSend = inputText;

		setInputText('');

		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/api/message/send`,
				{conversationId: conversationId, content: textToSend},
				{headers: {Authorization: `Bearer ${token}`}}
			);
			
			const aiReply = response.data.data;
			setMessages((prev) => [...prev, aiReply]);
			
		} catch (error) {
			console.error("Failed to get AI response:", error);
		}
	}
		
	return (
		
		<div className="chat-container">
			<div className="chat-header">
				<h2>{character.name}</h2>
			</div>
			
			<div className="chat-history">
				{messages.map((msg) => (
					<div key={msg.id} className={`chat-bubble-container ${msg.role}`}>
						<div className={`chat-bubble ${msg.role}`}>
							<ReactMarkdown>
								{msg.content}
							</ReactMarkdown>

						</div>
					</div>
				))}
				<div ref={messagesEndRef} />
			</div>

				
			<form className="chat-input-form" onSubmit={handleSendMessage}>
				<input
					type="text"
					value={inputText}
					onChange={(e) => setInputText(e.target.value)}
					placeholder="Type a message..."
					className="chat-input"
					autoComplete="off"
				/>
				<button type="submit">Send</button>
			</form>
		</div>
	);
}