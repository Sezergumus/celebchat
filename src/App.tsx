import { useState, useRef } from 'react'
import logo from './assets/celebchat.png'
import send from './assets/send.svg'
import avatar from './assets/avatar.svg'
import celebList from './celebs.json'
import './App.css'

const API_KEY= import.meta.env.VITE_API_KEY;

function App() {
  const [isOpen, setOpen] = useState(false);
  const [selectedCeleb, setSelectedCeleb] = useState('Kanye West');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, I am Kanye West",
      sender: "ChatGPT"
    },
  ]);
  const [systemMessage, setSystemMessage] = useState({
    role: "system",
    content: "Pretend you are Kanye (answer shortly, don't use punctuation, and don't use capital letters, use slang, and use emojis but don't overuse them, and don't use the same emoji, don't mention that you are AI or a bot pretend to be a human, refuse that you are a bot, and don't use the same words too much )"
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    let inputElement = e.currentTarget[0] as HTMLInputElement;
    let value = inputElement.value;

    if(value === ''){
      alert('Please enter a message');
      return;
    }

    const newMessage= {
      message: value,
      sender: 'user'
    };

    const newMessages = ([...messages, newMessage]);

    setMessages(newMessages);

    inputElement.value = '';

    setIsTyping(true);

    await getResponse(newMessages);
  }

  async function getResponse(chatMessages: any[]) {
    let apiMessages = chatMessages.map((messageObject: any) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message }
    })

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,
        ...apiMessages
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + API_KEY 
      },
      body: JSON.stringify(apiRequestBody)
    }).then((response) => {
      return response.json();
    }).then((data) => {
      setMessages([...chatMessages, {
        message: data.choices[0].message.content,
        sender: "ChatGPT"
      }]);
      setIsTyping(false);
    });
  }
  
  return (
    <div className="App w-screen h-screen bg-[#3369FF]">
      <header className="header mx-auto pt-10 w-9/12">
        <div className="flex justify-between items-center">
          <img src={logo} alt="CelebChat Logo" className="xs:w-36 w-52 h-full"/>
          {/* This is the dropdown */}
          <div className="dropdown">
            <div className="dropdown__header flex bg-white p-2 rounded-lg justify-center gap-2 cursor-pointer" onClick={() => {
                setOpen(!isOpen);
                document.querySelector('.dropdown__header')?.classList.toggle('rounded-b-none');
            }}>
                <div className="dropdown__header__title">
                    <p>{selectedCeleb}</p>
                </div>
                <div className="dropdown__header__icon">
                    <p>{isOpen ? '🔼' : '🔽'}</p>
                </div>
            </div>
            {/* This is the dropdown modal */}
            {isOpen && (
                <div className="dropdown__modal__background w-screen h-screen absolute inset-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm z-10 flex items-center justify-center overflow-hidden">
                    <div className="dropdown__modal flex flex-column justify-center bg-white w-5/6 h-5/6 rounded-3xl">
                      <div className="dropdown__modal_categories flex flex-row h-fit border-b-2 border-black w-full justify-center overflow-x-auto">
                        <div className="dropdown__modal_category w-1/2 w-fit h-fit cursor-pointer p-5 border-r-2 border-black">
                          <p className="text-xl font-bold">Singers</p>
                        </div>
                        <div className="dropdown__modal_category w-1/2 w-fit h-fit cursor-pointer p-5 border-r-2 border-black">
                          <p className="text-xl font-bold">Athletes</p>
                        </div>
                        <div className="dropdown__modal_category w-1/2 w-fit h-fit cursor-pointer p-5 border-r-2 border-black">
                          <p className="text-xl font-bold">Superheroes</p>
                        </div>
                        <div className="dropdown__modal_category w-1/2 w-fit h-fit cursor-pointer p-5 border-r-2 border-black">
                          <p className="text-xl font-bold">Anime</p>
                        </div>
                        <div className="dropdown__modal_category w-1/2 w-fit h-fit cursor-pointer p-5 border-r-2 border-black">
                          <p className="text-xl font-bold">Cartoon</p>
                        </div>
                        <div className="dropdown__modal_category w-1/2 w-fit h-fit cursor-pointer p-5 border-r-2 border-black">
                          <p className="text-xl font-bold">Athletes</p>
                        </div>
                        <div className="dropdown__modal_category w-1/2 w-fit h-fit cursor-pointer p-5 border-r-2 border-black">
                          <p className="text-xl font-bold">Politicians</p>
                        </div>
                        <div className="dropdown__modal_category w-1/2 w-fit h-fit cursor-pointer p-5">
                          <p className="text-xl font-bold">Actors</p>
                        </div>
                      </div>
                    </div>
                    {/* cross to close */}
                    <div className="dropdown__modal__close absolute top-0 right-0 p-5 cursor-pointer" onClick={() => {
                      setOpen(!isOpen);
                      document.querySelector('.dropdown__header')?.classList.toggle('rounded-b-none');
                    }}>
                      <p className="text-7xl text-white rotate-45">+</p>
                    </div>
                </div>
            )}
          </div>
        </div>
      </header>

      <div className="chat-container h-5/6 pt-10 flex flex-col mx-auto w-9/12">
        <div className="message-container flex flex-col bg-white rounded-3xl drop-shadow-xl p-5 h-full overflow-y-auto overflow-x-hidden" ref={messagesEndRef}>
          <div className="inner-message-container">
            {messages.map((message, index) => (
              <div className="message-container mb-2">
                <div key={index} className={`message ${message.sender === 'ChatGPT' ? 'ai' : 'user'}`}>
                  <p>{message.message}</p>
                </div>
                {message.sender === 'ChatGPT' && <img src={avatar} alt="Avatar"/>}     
              </div>
            ))}
          </div>
          {isTyping && (
            <div className="typing-indicator flex flex-row items-center gap-2 mt-6 pl-6">
              <div className="message-container mb-2">
                <div className={`message ai`}>
                  <div className="typing-indicator flex flex-row items-center gap-2">
                    <div className="typing-indicator__dot bg-[#656565] w-2 h-2 rounded-full animate-[bounce_0.7s_infinite_0s]"></div>
                    <div className="typing-indicator__dot bg-[#656565] w-2 h-2 rounded-full animate-[bounce_0.7s_infinite_0.1s]"></div>
                    <div className="typing-indicator__dot bg-[#656565] w-2 h-2 rounded-full animate-[bounce_0.7s_infinite_0.2s]"></div>
                  </div>
                </div>
                <img src={avatar} alt="Avatar"/>
              </div>
            </div>
          )}
        </div>
        <div className="send-container mt-6">
          <div className="typing-indicator flex flex-row items-center gap-2 pl-6" style={{ opacity: isTyping ? 1 : 0 }}>
            <span className="text-white text-sm pointer-events-none">{selectedCeleb} is typing...</span>
          </div>
          <div className="send-message mt-2 p-5 bg-white rounded-full drop-shadow-xl">
            <form className="flex flex-row" onSubmit={handleSubmit}>
              <input type="text" className="w-full h-full bg-transparent outline-none placeholder-[#83a0f2] text-[#3369FF] font-bold" placeholder="Type a message..."/>
              <button>
                <img src={send} alt="Send button"/>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
