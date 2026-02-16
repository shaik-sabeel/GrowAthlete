import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import backendApi from "../utils/backendApi";
import { getCurrentUserId } from "../utils/auth";
import moment from "moment";
import ChatRoomList from "../components/chat/ChatRoomList";
import LiveChat from "../components/chat/LiveChat";

const FeedPage = () => {
  const [media, setMedia] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [postText, setPostText] = useState("");
  const isPostValid = postText.trim() !== "" || media !== null;
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [copiedPostId, setCopiedPostId] = useState(null);
  const [roomSearch, setRoomSearch] = useState("");
  const [chatRooms, setChatRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [currentUserProfile, setCurrentUserProfile] = useState(null); // To track following list
  const [selectedRoom, setSelectedRoom] = useState(null);

  const currentUserId = getCurrentUserId();

  //mobile
  const [activeTab, setActiveTab] = useState("feed");

  // User List Modal State
  const [showUserListModal, setShowUserListModal] = useState(false);
  const [userListTitle, setUserListTitle] = useState("");
  const [userListUsers, setUserListUsers] = useState([]);
  const [userListSearch, setUserListSearch] = useState("");

  const openUserList = (title, users) => {
    setUserListTitle(title);
    setUserListUsers(users || []);
    setUserListSearch("");
    setShowUserListModal(true);
  };

  // Fetch posts, rooms, and user profile on load
  useEffect(() => {
    fetchPosts();
    fetchChatRooms();
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await backendApi.get("/auth/profile");
      setCurrentUserProfile(response.data.user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoadingPosts(true);
      const response = await backendApi.get("/community/public");
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchChatRooms = async () => {
    try {
      setLoadingRooms(true);
      const response = await backendApi.get("/chatrooms");
      setChatRooms(response.data || []);
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
    } finally {
      setLoadingRooms(false);
    }
  };

  const handleCreatePost = async () => {
    if (!isPostValid) return;

    const formData = new FormData();
    formData.append("content", postText);
    if (mediaFile) {
      formData.append("media", mediaFile);
    }

    try {
      const response = await backendApi.post("/community", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setPosts([response.data, ...posts]);

      setPostText("");
      if (media) URL.revokeObjectURL(media);
      setMedia(null);
      setMediaFile(null);
      setMediaType(null);
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    }
  };


  const handleLike = async (postId) => {
    const postIndex = posts.findIndex(p => p._id === postId);
    if (postIndex === -1) return;

    const post = posts[postIndex];
    const isLiked = post.likes.some(id => (typeof id === 'string' ? id === currentUserId : id._id === currentUserId));

    // Optimistic update
    const updatedPosts = [...posts];
    if (isLiked) {
      updatedPosts[postIndex].likes = post.likes.filter(id => (typeof id === 'string' ? id !== currentUserId : id._id !== currentUserId));
    } else {
      updatedPosts[postIndex].likes = [...post.likes, currentUserId];
    }
    setPosts(updatedPosts);

    try {
      if (isLiked) {
        await backendApi.delete(`/community/${postId}/like`);
      } else {
        await backendApi.post(`/community/${postId}/like`);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      setPosts(posts); // Revert
    }
  };

  const handleFollow = async (authorId) => {
    if (!authorId || authorId === currentUserId) {
      return;
    }

    const isFollowing = currentUserProfile?.following?.some(f => (typeof f === 'string' ? f : f._id) === authorId);
    console.log("isFollowing:", isFollowing);

    // Optimistic update
    const updatedProfile = { ...currentUserProfile };
    if (isFollowing) {
      updatedProfile.following = updatedProfile.following.filter(f => (typeof f === 'string' ? f : f._id) !== authorId);
    } else {
      updatedProfile.following = [...(updatedProfile.following || []), authorId];
    }
    setCurrentUserProfile(updatedProfile);

    try {
      if (isFollowing) {
        await backendApi.post(`/auth/unfollow/${authorId}`);
      } else {
        await backendApi.post(`/auth/follow/${authorId}`);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        alert(`Follow action failed: ${error.response.data.message}`);
      }
      fetchUserProfile(); // Revert/Refresh on error
    }
  };

  const handleAddComment = async (postId) => {
    if (!commentText.trim()) return;

    try {
      const response = await backendApi.post(`/community/${postId}/comments`, {
        content: commentText
      });

      const updatedPosts = posts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            comments: [...post.comments, response.data.comment]
          };
        }
        return post;
      });
      setPosts(updatedPosts);
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };


  const handleShare = (postId) => {
    const shareUrl = `${window.location.origin}/post/${postId}`;

    if (navigator.share) {
      navigator.share({
        title: "Check out this post",
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopiedPostId(postId);
      setTimeout(() => setCopiedPostId(null), 2000);
    }
  };

  const handleJoinRoom = async (roomId) => {
    try {
      await backendApi.post(`/chatrooms/${roomId}/join`);
      fetchChatRooms();
      alert("Joined room successfully!");
    } catch (error) {
      console.error("Error joining room:", error);
      if (error.response?.data?.message === "Already joined") {
        alert("You have already joined this room.");
      }
    }
  }


  const filteredRooms = chatRooms.filter(room =>
    room.name.toLowerCase().includes(roomSearch.toLowerCase()) ||
    room.category.toLowerCase().includes(roomSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans relative overflow-x-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-24 md:pb-6 relative z-10">

        <aside
          className={`col-span-12 lg:col-span-4 space-y-6 ${activeTab === "feed" ? "hidden lg:block" : "block"} lg:sticky lg:top-24 h-fit`}
        >

          {/* Modal for User List */}
          {showUserListModal && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowUserListModal(false)}>
              <div className="bg-gray-800 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 bg-gray-800 sticky top-0 z-10">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-bold text-white">{userListTitle}</h3>
                    <button
                      onClick={() => setShowUserListModal(false)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder={`Search ${userListTitle.toLowerCase()}...`}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    value={userListSearch}
                    onChange={(e) => setUserListSearch(e.target.value)}
                  />
                </div>

                <div className="overflow-y-auto p-4 space-y-4">
                  {userListUsers.filter(u => u.username.toLowerCase().includes(userListSearch.toLowerCase())).length === 0 ? (
                    <p className="text-center text-slate-500 py-8">No users found.</p>
                  ) : (
                    userListUsers
                      .filter(u => u.username.toLowerCase().includes(userListSearch.toLowerCase()))
                      .map(user => (
                        <div key={user._id} className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-xl transition-colors">
                          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                            {user.profilePicture ? (
                              <img src={user.profilePicture} alt={user.username} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-slate-300 text-slate-500 font-bold text-xs">
                                {user.username?.[0]?.toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="flex-grow min-w-0">
                            <strong className="block text-white font-semibold truncate">{user.username}</strong>
                            {user.bio && <p className="text-xs text-gray-400 truncate">{user.bio}</p>}
                          </div>
                          {user._id !== currentUserId && (
                            <button
                              onClick={() => {
                                handleFollow(user._id);
                              }}
                              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${currentUserProfile?.following?.some(f => (typeof f === 'string' ? f : f._id) === user._id)
                                ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                                }`}
                            >
                              {currentUserProfile?.following?.some(f => (typeof f === 'string' ? f : f._id) === user._id) ? "Unfollow" : "Follow"}
                            </button>
                          )}
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-700">
            <div className="flex justify-around mb-6">
              <div className="text-center cursor-pointer hover:opacity-80 transition-opacity" onClick={() => openUserList("Followers", currentUserProfile?.followers)}>
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">{currentUserProfile?.followers?.length || 0}</h3>
                <span className="text-sm text-gray-400 font-medium">Followers</span>
              </div>
              <div className="text-center cursor-pointer hover:opacity-80 transition-opacity" onClick={() => openUserList("Following", currentUserProfile?.following)}>
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">{currentUserProfile?.following?.length || 0}</h3>
                <span className="text-sm text-gray-400 font-medium">Following</span>
              </div>
            </div>

            <button
              onClick={() => openUserList("Followers", currentUserProfile?.followers)}
              className="w-full mb-3 py-2 px-4 bg-transparent border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors text-sm font-medium"
            >
              View followers
            </button>
            <button
              onClick={() => openUserList("Following", currentUserProfile?.following)}
              className="w-full py-2 px-4 bg-transparent border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors text-sm font-medium"
            >
              View following
            </button>
          </div>

          <div className="hidden lg:block h-[500px] mt-6">
            <ChatRoomList onSelectRoom={setSelectedRoom} activeRoomId={selectedRoom?._id} />
          </div>

          {/* Sidebar Ad Widget */}
          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl shadow-lg p-6 border border-indigo-700/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
            <div className="relative z-10">
              <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider mb-3 inline-block">Sponsored</span>
              <h3 className="text-xl font-extrabold text-white mb-2 leading-tight">Unlock Your Full Potential 🚀</h3>
              <p className="text-indigo-200 text-sm mb-4">Get personalized coaching, exclusive stats, and more with <span className="text-white font-bold">GrowAthlete Pro</span>.</p>
              <Link to="/membership">
                <button className="w-full py-2.5 bg-white text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg">
                  Upgrade Now
                </button>
              </Link>
            </div>
          </div>
        </aside>

        <main
          className={`col-span-12 lg:col-span-8 space-y-6`}
        >
          {activeTab === "chat" ? (
            <div className="lg:hidden">
              {selectedRoom ? (
                <LiveChat room={selectedRoom} onBack={() => setSelectedRoom(null)} />
              ) : (
                <ChatRoomList onSelectRoom={setSelectedRoom} activeRoomId={selectedRoom?._id} />
              )}
            </div>
          ) : (
            <>
              <div className="hidden lg:block mb-6">
                {selectedRoom && (
                  <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <LiveChat room={selectedRoom} onBack={() => setSelectedRoom(null)} />
                  </div>
                )}
              </div>

              {/* Create Post Widget (Dark Theme) */}
              <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg shadow-orange-500/5 p-5 border border-gray-700 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-pink-500 opacity-80"></div>

                <div className="flex gap-4 mb-4 mt-2">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0">
                    {/* Placeholder or User Avatar if available */}
                    {currentUserProfile?.profilePicture && (
                      <img src={currentUserProfile.profilePicture} alt="Me" className="w-full h-full object-cover rounded-full" />
                    )}
                  </div>

                  <div className="flex-grow">
                    <textarea
                      placeholder="Share your latest achievement or update..."
                      rows="3"
                      maxLength={500}
                      className="w-full resize-none bg-gray-900 border border-gray-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                      value={postText}
                      onChange={(e) => setPostText(e.target.value)}
                    />
                  </div>
                </div>

                {media && (
                  <div className="mb-4 pl-14">
                    <div className="relative inline-block group">
                      <div className="w-32 h-20 rounded-lg overflow-hidden border border-gray-600 bg-black cursor-pointer" onClick={() => setShowPreview(true)}>
                        {mediaType === "image" ? (
                          <img src={media} alt="preview" className="w-full h-full object-cover" />
                        ) : (
                          <video src={media} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <button
                        className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900/80 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-500 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          URL.revokeObjectURL(media);
                          setMedia(null);
                          setMediaFile(null);
                          setMediaType(null);
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pl-14 pt-2">
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-600 bg-gray-700 hover:bg-gray-600 cursor-pointer transition-colors text-sm text-gray-300 group">
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setMedia(URL.createObjectURL(file));
                            setMediaFile(file);
                            setMediaType("image");
                          }
                        }}
                      />
                      <span className="grayscale group-hover:grayscale-0 transition-all">🖼️</span> Image
                    </label>

                    <label className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-600 bg-gray-700 hover:bg-gray-600 cursor-pointer transition-colors text-sm text-gray-300 group">
                      <input
                        type="file"
                        accept="video/*"
                        hidden
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setMedia(URL.createObjectURL(file));
                            setMediaFile(file);
                            setMediaType("video");
                          }
                        }}
                      />
                      <span className="grayscale group-hover:grayscale-0 transition-all">🎥</span> Video
                    </label>
                  </div>

                  <button
                    className={`px-6 py-2 bg-gradient-to-r from-orange-600 to-pink-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-orange-900/40 transform hover:-translate-y-0.5 hover:shadow-orange-700/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none`}
                    disabled={!isPostValid}
                    onClick={handleCreatePost}
                  >
                    Post
                  </button>
                </div>
              </div>

              {/* Preview Modal */}
              {showPreview && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setShowPreview(false)}>
                  <div className="relative max-w-5xl max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
                      onClick={() => setShowPreview(false)}
                      aria-label="Close preview"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    {mediaType === "image" ? (
                      <img src={media} alt="full-preview" className="max-w-full max-h-[85vh] rounded-lg" />
                    ) : (
                      <video src={media} controls autoPlay className="max-w-full max-h-[85vh] rounded-lg" />
                    )}
                  </div>
                </div>
              )}

              {/* Feed Loop (Dark Theme) */}
              <div className="space-y-6">
                {loadingPosts ? (
                  <div className="text-center py-10">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-slate-500 text-sm">Loading feed...</p>
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-10 bg-gray-800 rounded-2xl border border-gray-700">
                    <p className="text-gray-400">No posts yet. Be the first to share something!</p>
                  </div>
                ) : (
                  posts.map((post, index) => {
                    const isLiked = post.likes ? post.likes.some(id => (typeof id === 'string' ? id === currentUserId : id._id === currentUserId)) : false;
                    const likeCount = post.likes ? post.likes.length : 0;
                    const commentCount = post.comments ? post.comments.length : 0;
                    const authorName = post.author?.username || "Unknown User";
                    const authorId = post.author?._id;
                    const timeAgo = moment(post.createdAt).fromNow();
                    const getMediaUrl = (url) => {
                      if (!url) return null;
                      if (url.startsWith('http')) return url;
                      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
                      return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
                    };
                    const mediaUrl = post.media && post.media.length > 0 ? getMediaUrl(post.media[0].url) : null;

                    const isFollowing = currentUserProfile?.following?.includes(authorId);
                    const isMe = authorId === currentUserId;

                    return (
                      <div key={post._id}>
                        {/* In-Feed Ad Insertion (e.g., after every 3rd post) */}
                        {(index > 0 && index % 3 === 0) && (
                          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-0 mb-6 overflow-hidden hover:border-orange-500/30 transition-all group">
                            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 flex justify-between items-center border-b border-gray-700/50">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sponsored</span>
                                <span className="text-xs text-gray-500">•</span>
                                <span className="text-xs text-gray-300 font-medium">Nike</span>
                              </div>
                              <button className="text-blue-400 text-xs font-bold hover:text-blue-300">Shop Now ↗</button>
                            </div>
                            <div className="p-6 relative">
                              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                              <h3 className="text-lg font-bold text-white mb-2 relative z-10">Just Do It.</h3>
                              <p className="text-gray-400 text-sm mb-4 max-w-lg relative z-10">
                                Discover the latest collection of performance gear designed to help you push your limits.
                              </p>
                              <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden relative flex items-center justify-center border border-gray-700/50 group-hover:border-orange-500/20 transition-all">
                                <span className="text-6xl animate-pulse grayscale opacity-20">👟</span>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-700 hover:border-gray-600 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300">

                          <div className="flex gap-4 items-start mb-4">
                            <div className="w-11 h-11 rounded-full bg-gray-700 overflow-hidden">
                              {post.author?.profilePicture && (
                                <img src={post.author.profilePicture} alt={authorName} className="w-full h-full object-cover" />
                              )}
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <strong className="text-white font-semibold">{authorName}</strong>
                                  {post.author?.isVerified && (
                                    <span className="bg-blue-50 text-blue-600 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Verified</span>
                                  )}
                                </div>

                                {!isMe && (
                                  <button
                                    onClick={() => handleFollow(authorId)}
                                    className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${isFollowing
                                      ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                      : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                                      }`}
                                  >
                                    {isFollowing ? "Unfollow" : "Follow"}
                                  </button>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">{timeAgo}</p>
                            </div>
                          </div>

                          {post.title && <h3 className="text-lg font-bold text-white mb-2">{post.title}</h3>}
                          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line mb-4">{post.content}</p>

                          {mediaUrl && (
                            <div className="w-full h-auto bg-slate-200 rounded-xl mb-4 overflow-hidden">
                              {post.media[0].mediaType === 'video' ? (
                                <video src={mediaUrl} controls className="w-full h-full object-cover" />
                              ) : (
                                <img src={mediaUrl} alt="Post content" className="w-full h-full object-cover" />
                              )}
                            </div>
                          )}

                          <div className="flex items-center gap-6 pt-4 border-t border-gray-700 mb-2">
                            <button
                              className={`flex items-center gap-2 text-sm font-medium transition-colors ${isLiked ? "text-blue-400" : "text-gray-400 hover:text-gray-200"}`}
                              onClick={() => handleLike(post._id)}
                            >
                              <span>{isLiked ? "👍" : "👍"}</span>
                              <span>{likeCount}</span>
                            </button>

                            <button
                              className={`flex items-center gap-2 text-sm font-medium transition-colors ${activeCommentPost === post._id ? "text-blue-400" : "text-gray-400 hover:text-gray-200"}`}
                              onClick={() =>
                                setActiveCommentPost(
                                  activeCommentPost === post._id ? null : post._id
                                )
                              }
                            >
                              <span>💬</span>
                              <span>{commentCount}</span>
                            </button>

                            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                              <span>👁</span>
                              <span>{post.views || 0}</span>
                            </div>

                            <button
                              className="flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 ml-auto transition-colors"
                              onClick={() => handleShare(post._id)}
                            >
                              <span>{copiedPostId === post._id ? "✓ Copied!" : "🔗 Share"}</span>
                            </button>

                          </div>

                          {activeCommentPost === post._id && (
                            <div className="mt-4 pt-4 border-t border-gray-700 animate-in fade-in slide-in-from-top-2 duration-300">

                              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                                {post.comments.length === 0 ? (
                                  <p className="text-center text-gray-500 text-sm py-2">No comments yet</p>
                                ) : (
                                  post.comments.map((c, i) => (
                                    <div key={i} className="bg-gray-700/50 p-3 rounded-xl border border-gray-700">
                                      <strong className="block text-white text-sm font-semibold mb-1">{c.author?.username || "Unknown"}</strong>
                                      <span className="block text-gray-300 text-sm">{c.content}</span>
                                    </div>
                                  ))
                                )}
                              </div>

                              <div className="flex gap-2 items-end">
                                <textarea
                                  placeholder="Write a comment..."
                                  className="flex-grow resize-none bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                  value={commentText}
                                  onChange={(e) => setCommentText(e.target.value)}
                                  rows="1"
                                />
                                <button
                                  className="bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  onClick={() => handleAddComment(post._id)}
                                  disabled={!commentText.trim()}
                                >
                                  Send
                                </button>
                              </div>

                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </main>
      </div >

      <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-2 flex justify-around lg:hidden z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.2)]">
        <button
          className={`flex-1 py-3 text-sm font-medium flex flex-col items-center gap-1 rounded-lg transition-colors ${activeTab === "feed" ? "text-orange-500 bg-orange-500/10" : "text-gray-400 hover:text-white"}`}
          onClick={() => setActiveTab("feed")}
        >
          <span className="text-lg">🏠</span>
          Feed
        </button>

        <button
          className={`flex-1 py-3 text-sm font-medium flex flex-col items-center gap-1 rounded-lg transition-colors ${activeTab === "chat" ? "text-orange-500 bg-orange-500/10" : "text-gray-400 hover:text-white"}`}
          onClick={() => setActiveTab("chat")}
        >
          <span className="text-lg">💬</span>
          Live Chat
        </button>
      </nav>

    </div >
  );
};

export default FeedPage;
// deploy