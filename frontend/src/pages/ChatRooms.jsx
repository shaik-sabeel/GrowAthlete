import "../pages_css/ChatRooms.css";
import { useState, useRef , useEffect} from "react";
import { Search, Plus , UserPlus } from "lucide-react";
import EmojiPicker from "emoji-picker-react";


export default function ChatRooms() {
  const [activeRoomId, setActiveRoomId] = useState("1");
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [error, setError] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [messageSearch, setMessageSearch] = useState("");
  const [friendSearch, setFriendSearch] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiRef = useRef(null);
  const [chatRooms, setChatRooms] = useState([
    {
      id: "1",
      name: "Morning Run Club",
      description: "Don't forget to bring water!",
      time: "9:30 AM",
      unread: 3,
    },
    {
      id: "2",
      name: "Cricket Club",
      description: "Great match yesterday!",
      time: "8:45 AM",
      unread: 0,
    },
    {
      id: "3",
      name: "Football Club",
      description: "Who is watching the game?",
      time: "Yesterday",
      unread: 5,
    },
    {
      id: "4",
      name: "Tennis Club",
      description: "Courts are booked for Sunday",
      time: "Yesterday",
      unread: 0,
    },
    {
      id: "5",
      name: "Basketball Club",
      description: "Practice starts at 7 PM",
      time: "2 days ago",
      unread: 1,
    },
  ]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      username: "Alex Runner",
      text: "Hey everyone! Who's up for a 5K run tomorrow morning at 6 AM?",
      time: "9:15 AM",
    },
    {
      id: 2,
      username: "Sarah Fitness",
      text: "Count me in! What's the route?",
      time: "9:17 AM",
    },
    {
      id: 3,
      username: "Mike Sports",
      text: "I'm thinking we could do the park loop. It's pretty scenic and mostly flat.",
      time: "9:20 AM",
    },
    {
      id: 4,
      username: "Emma Active",
      text: "Sounds great! Should we meet at the main entrance?",
      time: "9:25 AM",
    },
  ]);

  const mockFriends = [
    { id: 1, name: "Alex Runner", activity: "In Morning Run Club" },
    { id: 2, name: "Sarah Fitness", activity: "In Cricket Club" },
    { id: 3, name: "Mike Sports", activity: "In Football Club" },
    { id: 4, name: "Emma Active", activity: "Idle" },
    { id: 5, name: "Lisa Tennis", activity: "Do Not Disturb" },
    { id: 6, name: "Jenny Yoga", activity: "Offline" },
    { id: 7, name: "Ryan Gym", activity: "Offline" }
  ];

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveMenu(null);
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const [currentUser, setCurrentUser] = useState({
    id: "u1",
    name: "Alex Runner",
    status: "online"
  });

  const activeRoom =
    chatRooms.find((room) => room.id === activeRoomId) || chatRooms[0];

  const handleCreate = () => {
    if (!newRoomName.trim()) {
      setError("This is required");
      return;
    }

    if (editingRoomId) {
      // EDIT MODE
      setChatRooms((prev) =>
        prev.map((room) =>
          room.id === editingRoomId
            ? {
                ...room,
                name: newRoomName,
                description: roomDescription,
              }
            : room
        )
      );
    } else {
      const newRoom = {
        id: Date.now().toString(),
        name: newRoomName,
        description: roomDescription,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        unread: 0,
      };

      setChatRooms((prev) => [newRoom, ...prev]);
      setActiveRoomId(newRoom.id);
    }
    setNewRoomName("");
    setRoomDescription("");
    setEditingRoomId(null);
    setShowCreateModal(false);
    setError("");
  };

  const handleEdit = (room) => {
    setNewRoomName(room.name);
    setRoomDescription(room.description);
    setEditingRoomId(room.id);
    setShowCreateModal(true);
    setActiveMenu(null);
  };

  const handleDelete = (id) => {
    setChatRooms((prev) => prev.filter((room) => room.id !== id));
    setActiveMenu(null);
  };
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      setAppliedSearch(searchQuery.trim());
    }
  };
  const filteredRooms = chatRooms.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredMessages = messages.filter((msg) =>
    msg.text.toLowerCase().includes(messageSearch.toLowerCase())
  );
  const handleSendMessage = () => {
  if (!newMessage.trim()) return;

  const newMsg = {
      id: Date.now(),
      username: currentUser.name,
      text: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage("");
  };
  const filteredFriends = mockFriends.filter((friend) =>
    friend.name.toLowerCase().includes(friendSearch.toLowerCase())
  );


  /*jsx*/

  return (
    <div className="page">
      <div className="app">

        {/* LEFT SIDEBAR */}
        <div className="sidebar">
          <div className="profile">
            <div className="default-avatar">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c1.5-4 6-6 8-6s6.5 2 8 6" />
                  </svg>
            </div>
            <div>
              <div className="name">{currentUser?.name}</div>
              <div className="status">
                {currentUser?.status === "online" ? "Online" : "Offline"}
              </div>
            </div>
          </div>

          <div className="sidebar-search-wrapper">
            <input
              className="search"
              placeholder="Search rooms by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {searchQuery && (
              <button
                className="clear-search-btn"
                onClick={() => setSearchQuery("")}
              >
                ✕
              </button>
            )}
          </div>
          <div className="create-room-container">
            <button onClick={() => setShowCreateModal(true)} className="create-room-btn">
              <Plus className="create-icon" />
              Create New Room
            </button>
          </div>

          <div className="section-title">ALL ROOMS ({chatRooms.length})</div>

          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
            <div
              key={room.id}
              className={`room ${
                activeRoomId === room.id ? "room-active" : ""
              }`}
              onClick={() => setActiveRoomId(room.id)}
            >
              <div>
                <div className="room-name">{room.name}</div>
                <div className="room-sub">{room.description}</div>
              </div>

              <div className="room-meta">
                <span className="room-time">{room.time}</span>

                <div className="room-menu-wrapper">
                  <div className="menu-container"></div>
                  <button
                    className="menu-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenu(room.id);
                    }}
                  >
                    ⋯
                  </button>

                  {activeMenu === room.id && (
                    <div className="menu-dropdown">
                      <div
                        className="menu-item"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(room);
                        }}
                      >
                        Edit
                      </div>
                      <div
                        className="menu-item delete-item"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(room.id);
                        }}
                      >
                        Delete
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
            </div>
           ))
          ) : (
            <div className="no-rooms">Room not found</div>
          )}


          {showCreateModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <div className="modal-title">Create New Room</div>

              <label className="modal-label">Room Name</label>
              <input
                className="modal-input"
                type="text"
                placeholder="Enter room name"
                value={newRoomName}
                onChange={(e) => {
                  setNewRoomName(e.target.value);
                  setError("");
                }}
              />
              <label className="modal-label">Description</label>
              <input
                className="modal-input"
                type="text"
                placeholder="Enter room description"
                value={roomDescription}
                onChange={(e) => setRoomDescription(e.target.value)}
              />


              {error && <div className="modal-error">{error}</div>}

              <div className="modal-buttons">
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setShowCreateModal(false);
                    setError("");
                    setNewRoomName("");
                  }}
                >
                  Cancel
                </button>

                <button className="create-btn" onClick={handleCreate}>
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
        </div>

        {/* CHAT AREA */}
        
        <div className="chat">

          <div className="chat-header">
            <div className="chat-header-left">
              <h2 className="room-title">{activeRoom.name}</h2>

              <div className="chat-search-wrapper">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="chat-search-input"
                  value={messageSearch}
                  onChange={(e) => setMessageSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="messages">
            {filteredMessages.map((msg) => (
              <div key={msg.id} className="message">
                <div className="default-avatar">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c1.5-4 6-6 8-6s6.5 2 8 6" />
                  </svg>
                </div>

                <div>
                  <div className="msg-header">
                    <span className="msg-name">{msg.username}</span>
                    <span className="msg-time">{msg.time}</span>
                  </div>
                  <div className="msg-text">{msg.text}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="message-input">
            <div className="message-input-container">
              <div className="emoji-wrapper" ref={emojiRef}>
                <button
                  className="emoji-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowEmojiPicker((prev) => !prev);
                  }}
                >
                  😊
                </button>

                {showEmojiPicker && (
                  <div className="emoji-picker-container">
                    <EmojiPicker
                      onEmojiClick={(emojiData) => {
                        setNewMessage((prev) => prev + emojiData.emoji);
                      }}
                      theme="light"
                    />
                  </div>
                )}
              </div>
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
                placeholder={`Message in ${activeRoom.name}`}
                className="message-input"
              />

              <button className="send-btn" onClick={handleSendMessage}>
                Send
              </button>
            </div>

          </div>
        </div>

        {/* FRIENDS SIDEBAR */}
        <div className="friends">
          <div className="friends-header">
            <span>Friends</span>
            <button className="add-friend-btn">
              <UserPlus size={18} />
            </button>
          </div>
          <div className="friends-search">
            <input
              className="search"
              placeholder="Search friends..."
              value={friendSearch}
              onChange={(e) => setFriendSearch(e.target.value)}
            />
          </div>
          <div className="friends-list">
              {filteredFriends.length > 0 ? (
                filteredFriends.map((friend) =>(
                <div key={friend.id} className="friend-item">

                  <div className="default-avatar">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c1.5-4 6-6 8-6s6.5 2 8 6" />
                    </svg>
                  </div>

                  <div className="friend-info">
                    <div className="friend-name">{friend.name}</div>

                    {friend.activity && (
                      <div className="friend-sub">
                        {friend.activity}
                      </div>
                    )}
                  </div>

                </div>
              ))) : (
                <div className="no-friends">No friends found</div>
              )}
            </div>


          </div>
          
        </div>
      </div>
    );
  }
