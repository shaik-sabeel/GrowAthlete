import { useState } from "react";

const mockUser = {
  followers: 1250,
  following: 320
};

const mockRooms = [
  {
    id: 1,
    name: "Morning Run Club",
    category: "Running",
    participants: 15
  },
  {
    id: 2,
    name: "Evening Stretch & Meditate",
    category: "Wellness",
    participants: 8
  },
  {
    id: 3,
    name: "Tactical Football Debrief",
    category: "Football",
    participants: 23
  }
];

const mockPosts = [
  {
    id: 1,
    author: "Rahul Sharma",
    verified: true,
    time: "2 hours ago",
    title: "Won National Athletics Championship!",
    content:
      "Absolutely thrilled to announce my victory at the National Athletics Championship in the 100m sprint! Hard work, dedication, and incredible support from my coach and team made this possible.",
    likes: 154,
    liked: false,
    comments: [],
    views: 201,
    image: true
  },
  {
    id: 2,
    author: "Priya Singh",
    verified: false,
    time: "1 day ago",
    title: "Completed Intense Training Block",
    content:
      "Just wrapped up a rigorous 8-week training block focusing on endurance and strength. Feeling stronger and more prepared than ever.",
    likes: 96,
    liked: true,
    comments: [
      {
        author: "Rahul Sharma",
        text: "Congrats Priya! Your dedication is inspiring!"
      }
    ],
    views: 142,
    image: true
  }
];

const FeedPage = () => {
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [postText, setPostText] = useState("");
  const isPostValid = postText.trim() !== "" || media !== null;
  const [posts, setPosts] = useState(mockPosts);
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [copiedPostId, setCopiedPostId] = useState(null);
  const [roomSearch, setRoomSearch] = useState("");

  //mobile
  const [activeTab, setActiveTab] = useState("feed");


  const handleLike = (postId) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1
          }
          : post
      )
    );
  };

  const handleAddComment = (postId) => {
    if (!commentText.trim()) return;

    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
            ...post,
            comments: [
              ...post.comments,
              {
                author: "You", // Assuming current user is "You" for now
                text: commentText
              }
            ]
          }
          : post
      )
    );

    setCommentText("");
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
      // alert("Post link copied!"); 
    }
  };


  const filteredRooms = mockRooms.filter(room =>
    room.name.toLowerCase().includes(roomSearch.toLowerCase()) ||
    room.category.toLowerCase().includes(roomSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <div className="max-w-6xl mx-auto px-4 py-28 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-24 md:pb-6">

        {/* LEFT SIDEBAR - Hidden on mobile unless chat tab is active (conceptually, though UI suggests tab switch might just toggle main view) */}
        {/* On large screens, sidebar is col-span-4. On small screens, we handle visibility via activeTab or just stack it. 
            Based on original code, activeTab toggles visibility. Let's make it responsive.
        */}

        <aside
          className={`col-span-12 lg:col-span-4 space-y-6 ${activeTab === "feed" ? "hidden lg:block" : "block"}`}
        >

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
            <div className="flex justify-around mb-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-black" style={{ color: "black" }}>{mockUser.followers}</h3>
                <span className="text-sm text-slate-500 font-medium">Followers</span>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-black" style={{ color: "black" }}>{mockUser.following}</h3>
                <span className="text-sm text-slate-500 font-medium">Following</span>
              </div>
            </div>

            <button className="w-full mb-3 py-2 px-4 bg-transparent border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors text-sm font-medium">
              View followers
            </button>
            <button className="w-full py-2 px-4 bg-transparent border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors text-sm font-medium">
              View following
            </button>
          </div>

          {/* Chat Rooms */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold text-black" style={{ color: "black" }}>Live Chat Rooms</h4>
              <span className="text-sm text-primary font-medium cursor-pointer hover:underline">Create room</span>
            </div>

            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search rooms..."
                className="w-full pl-4 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={roomSearch}
                onChange={(e) => setRoomSearch(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              {filteredRooms.length === 0 ? (
                <p className="text-center text-slate-500 py-4 text-sm">No rooms found</p>
              ) : (
                filteredRooms.map(room => (
                  <div className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg transition-colors group" key={room.id}>
                    <div>
                      <strong className="block text-slate-800 text-sm mb-0.5">{room.name}</strong>
                      <p className="text-xs text-slate-500">
                        {room.category} · {room.participants} participants
                      </p>
                    </div>
                    <button className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-md group-hover:bg-blue-600 group-hover:text-white transition-all">Join</button>
                  </div>
                ))
              )}
            </div>

          </div>
        </aside>

        {/* CENTER FEED */}
        <main
          className={`col-span-12 lg:col-span-8 space-y-6 ${activeTab === "chat" ? "hidden lg:block" : "block"}`}
        >

          {/* CREATE POST */}
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-100">

            {/* Top */}
            <div className="flex gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0"></div>

              <div className="flex-grow">
                <textarea
                  placeholder="Share your latest achievement or update..."
                  rows="3"
                  maxLength={500}
                  className="w-full resize-none bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                />
              </div>
            </div>

            {/* Media preview */}
            {media && (
              <div className="mb-4 pl-14">
                <div className="relative inline-block group">
                  <div className="w-32 h-20 rounded-lg overflow-hidden border border-slate-200 bg-black cursor-pointer" onClick={() => setShowPreview(true)}>
                    {mediaType === "image" ? (
                      <img src={media} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <video src={media} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <button
                    className="absolute -top-2 -right-2 w-6 h-6 bg-slate-900/80 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-500 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      URL.revokeObjectURL(media);
                      setMedia(null);
                      setMediaType(null);
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Bottom */}
            <div className="flex justify-between items-center pl-14 pt-2">

              <div className="flex gap-3">

                <label className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors text-sm text-slate-600 group">
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setMedia(URL.createObjectURL(file));
                        setMediaType("image");
                      }
                    }}
                  />
                  <span className="grayscale group-hover:grayscale-0 transition-all">🖼️</span> Image
                </label>

                <label className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors text-sm text-slate-600 group">
                  <input
                    type="file"
                    accept="video/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setMedia(URL.createObjectURL(file));
                        setMediaType("video");
                      }
                    }}
                  />
                  <span className="grayscale group-hover:grayscale-0 transition-all">🎥</span> Video
                </label>

              </div>

              <button
                className={`px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg shadow-button transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                disabled={!isPostValid}
                onClick={() => {
                  console.log({
                    text: postText,
                    media,
                    mediaType
                  });
                  if (media) {
                    URL.revokeObjectURL(media);
                  }
                  setPostText("");
                  setMedia(null);
                  setMediaType(null);
                }}
              >
                Post
              </button>
            </div>
          </div>

          {/* Media Modal */}
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

          {/* POSTS */}
          <div className="space-y-6">
            {posts.map(post => (
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100" key={post.id}>

                {/* Header */}
                <div className="flex gap-4 items-start mb-4">
                  <div className="w-11 h-11 rounded-full bg-slate-200"></div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 font-semibold">{post.author}</strong>
                      {post.verified && (
                        <span className="bg-blue-50 text-blue-600 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Verified</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{post.time}</p>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">{post.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line mb-4">{post.content}</p>

                {post.image && (
                  <div className="w-full h-64 bg-slate-200 rounded-xl mb-4 overflow-hidden">
                    {/* Placeholder for image */}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-6 pt-4 border-t border-slate-100 mb-2">
                  <button
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${post.liked ? "text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
                    onClick={() => handleLike(post.id)}
                  >
                    <span>{post.liked ? "👍" : "👍"}</span>
                    <span>{post.likes}</span>
                  </button>

                  <button
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${activeCommentPost === post.id ? "text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
                    onClick={() =>
                      setActiveCommentPost(
                        activeCommentPost === post.id ? null : post.id
                      )
                    }
                  >
                    <span>💬</span>
                    <span>{post.comments.length}</span>
                  </button>

                  <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <span>👁</span>
                    <span>{post.views}</span>
                  </div>

                  <button
                    className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 ml-auto transition-colors"
                    onClick={() => handleShare(post.id)}
                  >
                    <span>{copiedPostId === post.id ? "✓ Copied!" : "🔗 Share"}</span>
                  </button>

                </div>

                {/* Comment Section */}
                {activeCommentPost === post.id && (
                  <div className="mt-4 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">

                    {/* EXISTING COMMENTS */}
                    <div className="space-y-3 mb-4">
                      {post.comments.length === 0 ? (
                        <p className="text-center text-slate-400 text-sm py-2">No comments yet</p>
                      ) : (
                        post.comments.map((c, i) => (
                          <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <strong className="block text-slate-900 text-sm font-semibold mb-1">{c.author}</strong>
                            <span className="block text-slate-700 text-sm">{c.text}</span>
                          </div>
                        ))
                      )}
                    </div>

                    {/* ADD COMMENT */}
                    <div className="flex gap-2 items-end">
                      <textarea
                        placeholder="Write a comment..."
                        className="flex-grow resize-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        rows="1"
                      />
                      <button
                        className="bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleAddComment(post.id)}
                        disabled={!commentText.trim()}
                      >
                        Send
                      </button>
                    </div>

                  </div>
                )}
              </div>
            ))}
          </div>

        </main>
      </div>

      {/* Mobile Bottom Navigation - Visible only on small screens */}
      {/* 
         Fixing collapsing issue:
         - Added 'pb-24' to the main container to prevent content from being hidden behind the fixed nav.
         - 'fixed bottom-0 z-50' ensures it stays on top.
      */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-2 flex justify-around lg:hidden z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button
          className={`flex-1 py-3 text-sm font-medium flex flex-col items-center gap-1 rounded-lg transition-colors ${activeTab === "feed" ? "text-primary bg-primary/5" : "text-slate-500 hover:text-slate-900"}`}
          onClick={() => setActiveTab("feed")}
        >
          <span className="text-lg">🏠</span>
          Feed
        </button>

        <button
          className={`flex-1 py-3 text-sm font-medium flex flex-col items-center gap-1 rounded-lg transition-colors ${activeTab === "chat" ? "text-primary bg-primary/5" : "text-slate-500 hover:text-slate-900"}`}
          onClick={() => setActiveTab("chat")}
        >
          <span className="text-lg">💬</span>
          Live Chat
        </button>
      </nav>

    </div>
  );
};

export default FeedPage;
