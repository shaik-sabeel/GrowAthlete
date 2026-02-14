import { useState, useRef, useEffect } from "react";
import { Search, Plus, UserPlus } from "lucide-react";
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
    <div className="flex justify-center bg-white h-screen overflow-hidden pt-[80px]">
      <div className="flex flex-1 h-full bg-white border-x border-[#e5e7eb] shadow-[0_0_0_1px_rgba(0,0,0,0.04)] w-full max-w-[1600px] mx-auto">

        {/* LEFT SIDEBAR */}
        <div className="w-[300px] bg-[#f5f5f5] border-r border-[#e5e7eb] p-[15px] flex flex-col max-lg:w-[80px]">
          <div className="flex gap-[10px] items-center -mt-[10px] p-[15px] border-b border-[#d4d4d4] shadow-sm -mx-[15px] max-lg:justify-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#e5e7eb]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-5 h-5 text-gray-500"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c1.5-4 6-6 8-6s6.5 2 8 6" />
              </svg>
            </div>
            <div className="max-lg:hidden">
              <div className="font-bold text-base text-gray-900">{currentUser?.name}</div>
              <div className="text-[13px] text-gray-500 mt-[3px]">
                {currentUser?.status === "online" ? "Online" : "Offline"}
              </div>
            </div>
          </div>

          <div className="relative mb-[15px] max-lg:hidden">
            <input
              className="w-full py-[10px] pl-[12px] pr-[35px] rounded-lg border border-[#e5e5e5] text-gray-900 placeholder-gray-500 bg-white"
              placeholder="Search rooms by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {searchQuery && (
              <button
                className="absolute right-[10px] top-1/2 -translate-y-1/2 border-none bg-transparent cursor-pointer text-sm text-[#888] hover:text-black"
                onClick={() => setSearchQuery("")}
              >
                ✕
              </button>
            )}
          </div>
          <div className="p-[12px_12px_8px] max-lg:hidden">
            <button onClick={() => setShowCreateModal(true)} className="w-full flex items-center justify-center gap-2 py-[10px] px-4 bg-black text-white rounded-md border-none cursor-pointer font-medium -mt-[25px] transition-colors hover:bg-[#262626]">
              <Plus className="w-5 h-5" />
              Create New Room
            </button>
          </div>

          <div className="text-xs text-gray-500 my-[10px] mb-5 max-lg:hidden">ALL ROOMS ({chatRooms.length})</div>

          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <div
                key={room.id}
                className={`flex justify-between items-center p-[16px_18px] cursor-pointer border rounded-lg mb-[10px] transition-all duration-200 hover:bg-white ${activeRoomId === room.id ? "border-[#d4d4d4] bg-white shadow-sm" : "border-[#e5e5e5]"
                  } max-lg:p-2 max-lg:justify-center`}
                onClick={() => setActiveRoomId(room.id)}
              >
                <div className="max-lg:hidden">
                  <div className="font-semibold text-base mb-1 text-gray-900">{room.name}</div>
                  <div className="text-sm text-gray-500">{room.description}</div>
                </div>

                <div className="text-right text-xs text-[#9ca3af] flex flex-col items-end gap-1 relative max-lg:hidden">
                  <span className="">{room.time}</span>

                  <div className="relative">
                    <div className=""></div>
                    <button
                      className="!bg-transparent border-none cursor-pointer text-lg p-[4px_6px] rounded-md transition-colors hover:!bg-[#f0f0f0] !text-gray-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(room.id);
                      }}
                    >
                      ⋯
                    </button>

                    {activeMenu === room.id && (
                      <div className="absolute text-[#374151] top-7 right-0 w-20 bg-white border border-[#e6e6e6] rounded-[10px] shadow-[0_10px_25px_rgba(0,0,0,0.08)] py-1.5 z-50 animate-[dropdownFade_0.15s_ease-in-out]">
                        <div
                          className="px-3.5 py-2.5 text-sm cursor-pointer transition-colors hover:bg-[#f5f5f5] text-gray-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(room);
                          }}
                        >
                          Edit
                        </div>
                        <div
                          className="px-3.5 py-2.5 text-sm cursor-pointer transition-colors hover:bg-[#f5f5f5] text-gray-700"
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
            <div className="p-[15px] text-center text-sm text-[#888]">Room not found</div>
          )}


          {showCreateModal && (
            <div className="fixed inset-0 bg-black/35 flex justify-center items-center z-[1000]">
              <div className="bg-white w-[400px] p-7 rounded-xl shadow-[0_15px_30px_rgba(0,0,0,0.15)]">
                <div className="text-xl font-semibold mb-5 text-gray-900">Create New Room</div>

                <label className="block text-sm font-medium mb-1.5 text-gray-700">Room Name</label>
                <input
                  className="w-full p-3 rounded-lg border border-[#e5e5e5] text-sm mb-1.5 outline-none focus:border-black text-gray-900 bg-white placeholder-gray-500"
                  type="text"
                  placeholder="Enter room name"
                  value={newRoomName}
                  onChange={(e) => {
                    setNewRoomName(e.target.value);
                    setError("");
                  }}
                />
                <label className="block text-sm font-medium mb-1.5 text-gray-700">Description</label>
                <input
                  className="w-full p-3 rounded-lg border border-[#e5e5e5] text-sm mb-1.5 outline-none focus:border-black text-gray-900 bg-white placeholder-gray-500"
                  type="text"
                  placeholder="Enter room description"
                  value={roomDescription}
                  onChange={(e) => setRoomDescription(e.target.value)}
                />


                {error && <div className="text-xs text-red-500 mb-4">{error}</div>}

                <div className="flex gap-3 mt-2.5">
                  <button
                    className="flex-1 p-3 !bg-[#e5e5e5] !text-black border-none rounded-lg font-semibold cursor-pointer transition-colors hover:!bg-[#d5d5d5]"
                    onClick={() => {
                      setShowCreateModal(false);
                      setError("");
                      setNewRoomName("");
                    }}
                  >
                    Cancel
                  </button>

                  <button className="flex-1 p-3 !bg-black !text-white border-none rounded-lg font-semibold cursor-pointer transition-colors hover:!bg-[#222]" onClick={handleCreate}>
                    Create
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CHAT AREA */}

        <div className="flex flex-col flex-1 h-full bg-white rounded-[20px] overflow-hidden">

          <div className="flex justify-between items-center px-5 py-4 bg-white border-b border-[#e5e7eb]">
            <div className="flex items-center gap-5">
              <h2 className="text-xl font-semibold text-[#111827] mr-[95px]">{activeRoom.name}</h2>

              <div className="flex items-center bg-[#f3f4f6] px-[18px] py-[6px] rounded-lg w-[200px] border border-[#dcdaad] ml-[150px]">
                <Search size={16} className="text-[#6b7280] mr-2" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="border-none outline-none bg-transparent w-full text-sm text-[#374151] placeholder-gray-500"
                  value={messageSearch}
                  onChange={(e) => setMessageSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {filteredMessages.map((msg) => (
              <div key={msg.id} className="flex gap-2.5 mb-[18px]">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#e5e7eb]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="w-5 h-5 text-gray-500"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c1.5-4 6-6 8-6s6.5 2 8 6" />
                  </svg>
                </div>

                <div>
                  <div className="flex gap-2.5 text-sm">
                    <span className="font-bold text-gray-900">{msg.username}</span>
                    <span className="text-xs text-gray-500">{msg.time}</span>
                  </div>
                  <div className="mt-1 text-gray-800">{msg.text}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2.5">
            <div className="flex items-center gap-2.5 px-[18px] py-[14px] border-t border-[#eeeeee] bg-white rounded-[25px]">
              <div className="relative" ref={emojiRef}>
                <button
                  className="border-none !bg-[#f5f5f5] p-[8px_10px] rounded-full cursor-pointer text-base hover:!bg-[#e5e5e5] !text-black"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowEmojiPicker((prev) => !prev);
                  }}
                >
                  😊
                </button>

                {showEmojiPicker && (
                  <div className="absolute bottom-[50px] left-0 z-[1000] shadow-[0_10px_30px_rgba(0,0,0,0.1)] rounded-xl overflow-hidden">
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
                className="flex-1 px-4 py-3 rounded-[25px] border border-[#e5e5e5] text-sm outline-none bg-[#f9f9f9] focus:border-black focus:bg-white text-gray-900 placeholder-gray-500"
              />

              <button className="!bg-black !text-white border-none px-[18px] py-2.5 rounded-[20px] cursor-pointer font-medium transition-colors hover:!bg-[#222] mt-[9px]" onClick={handleSendMessage}>
                Send
              </button>
            </div>

          </div>
        </div>

        {/* FRIENDS SIDEBAR */}
        <div className="w-[280px] bg-[#f5f5f5] border-l border-r border-[#e5e7eb] flex flex-col hidden xl:flex px-5">
          <div className="flex justify-between items-center p-4 text-xl font-semibold -mx-[15px] mb-[5px] -mt-[15px] border-b border-[#d4d4d4] shadow-sm">
            <span className="text-gray-900">Friends</span>
            <button
              style={{
                backgroundColor: "black",
                color: "white",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                cursor: "pointer"
              }}
            >
              <UserPlus size={18} color="white" strokeWidth={2.5} />
            </button>
          </div>
          <div className="px-4 mb-2.5 border-b-[1.6px] border-[#e5e7eb] -mx-3.5">
            <input
              className="w-full p-[13px] rounded-lg border border-[#e5e7eb] bg-white mb-2 text-gray-900 placeholder-gray-500"
              placeholder="Search friends..."
              value={friendSearch}
              onChange={(e) => setFriendSearch(e.target.value)}
            />
          </div>
          <div className="flex-1 overflow-y-auto px-4 w-[90%] pl-2">
            {filteredFriends.length > 0 ? (
              filteredFriends.map((friend) => (
                <div key={friend.id} className="flex items-center gap-2.5 py-2 cursor-pointer origin-top-left scale-[1.08] pb-2.5 hover:bg-[#d4d4d4] hover:rounded-md hover:pl-1.5">

                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#e5e7eb]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="w-5 h-5 text-gray-500"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c1.5-4 6-6 8-6s6.5 2 8 6" />
                    </svg>
                  </div>

                  <div className="flex flex-col origin-center scale-[1.07]">
                    <div className="font-semibold text-sm text-gray-900">{friend.name}</div>

                    {friend.activity && (
                      <div className="text-xs mt-[1.5px] text-[#6b7280]">
                        {friend.activity}
                      </div>
                    )}
                  </div>

                </div>
              ))) : (
              <div className="p-[15px] text-center text-[13px] text-[#9ca3af]">No friends found</div>
            )}
          </div>


        </div>

      </div>
    </div>
  );
}
