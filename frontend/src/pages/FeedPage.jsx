import "../pages_css/FeedPage.css";
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
                  author: currentUser.name,
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
    alert("Post link copied!");
  }
};


const filteredRooms = mockRooms.filter(room =>
  room.name.toLowerCase().includes(roomSearch.toLowerCase()) ||
  room.category.toLowerCase().includes(roomSearch.toLowerCase())
);

  return (
    <div className="app-scroll">
    <div className="feed-layout">

      {/* LEFT SIDEBAR */}
      <aside
          className={`left-sidebar ${
            activeTab === "chat" ? "active compact-chat" : ""
          }`}
        >

        <div className="profile-card">
          <div className="stats">
            <div>
              <h3>{mockUser.followers}</h3>
              <span>Followers</span>
            </div>
            <div>
              <h3>{mockUser.following}</h3>
              <span>Following</span>
            </div>
          </div>

          <button className="btn-outline">View followers</button>
          <button className="btn-outline">View following</button>
        </div>

        <div className="chat-rooms">
          <div className="chat-header">
            <h4>Live Chat Rooms</h4>
            <span className="link">Create room</span>
          </div>
          <div className="search-wrapper">
            <input
            type="text"
            placeholder="Search rooms..."
            className="input"
            value={roomSearch}
            onChange={(e) => setRoomSearch(e.target.value)}
          />
          </div>

          {filteredRooms.length === 0 ? (
            <p className="no-rooms">No rooms found</p>
          ) : (
            filteredRooms.map(room => (
              <div className="room" key={room.id}>
                <div>
                  <strong>{room.name}</strong>
                  <p>
                    {room.category} · {room.participants} participants
                  </p>
                </div>
                <button className="join-btn">Join</button>
              </div>
            ))
          )}

        </div>
      </aside>

      {/* CENTER FEED */}
      <main
  className={`feed-center ${
    activeTab === "chat" ? "hidden" : ""
  }`}
>

        {/* CREATE POST */}
        
        <div className="create-post-card">

          {/* Top */}
          <div className="create-post-top">
            <div className="user-avatar"></div>

            <textarea
              placeholder="Share your latest achievement or update..."
              rows="3"
              maxLength={500}
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
            />
            {/* <span className="char-count">
              {postText.length}/500
            </span> */}
          </div>

          {/* Media preview */}
          {media && (
            <div className="media-preview">
              <div className="media-thumb" onClick={() => setShowPreview(true)}>
                {mediaType === "image" ? (
                  <img src={media} alt="preview" />
                ) : (
                  <video src={media} />
                )}
                <span
                  className="remove-media"
                  onClick={(e) => {
                    e.stopPropagation();
                    URL.revokeObjectURL(media);
                    setMedia(null);
                    setMediaType(null);
                  }}
                >
                  ✕
                </span>
              </div>
            </div>
          )}

          {/* Bottom */}
          <div className="create-post-bottom">

            <div className="media-actions">

              <label className="media-pill image">
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
                🖼️ Image
              </label>

              <label className="media-pill video">
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
                🎥 Video
              </label>

            </div>

            <button className="post-btn-primary"
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
              Post Update
            </button>
          </div>
        </div>

        {showPreview && (
          <div className="media-modal" onClick={() => setShowPreview(false)}>
            <div className="media-modal-content constrained" onClick={(e) => e.stopPropagation()}>
              {/* CLOSE ICON */}
              <span
                className="close-modal"
                onClick={() => setShowPreview(false)}
                aria-label="Close preview"
              >
                ✕
              </span>
              {mediaType === "image" ? (
                <img src={media} alt="full-preview" />
              ) : (
                <video src={media} controls autoPlay />
              )}
            </div>
          </div>
        )}

        {/* POSTS */}
        {posts.map(post => (
          <div className="post-card" key={post.id}>
            <div className="post-header">
              <div className="avatar"></div>
              <div className="post-user-info">
                <strong>{post.author}</strong>
                {post.verified && (
                  <span className="verified">Verified</span>
                )}
              </div>
              <p className="time">{post.time}</p>
            </div>

            <h3>{post.title}</h3>
            <p className="post-text">{post.content}</p>

            {post.image && (
              <div className="post-image"></div>
            )}

            <div className="post-actions">
              <span
                className={`action ${post.liked ? "liked" : ""}`}
                onClick={() => handleLike(post.id)}
              >
                👍 {post.likes}
              </span>

              <span
                className="action"
                onClick={() =>
                  setActiveCommentPost(
                    activeCommentPost === post.id ? null : post.id
                  )
                }
              >
                💬 {post.comments.length}
              </span>

              <span>👁 {post.views}</span>
              <span
                className="share"
                onClick={() => handleShare(post.id)}
              >
                {copiedPostId === post.id ? "Copied!" : "🔗 Share post"}
              </span>

            </div>
            {activeCommentPost === post.id && (
            <div className="comment-box">

              {/* EXISTING COMMENTS */}
              <div className="comments-list">
                {post.comments.length === 0 ? (
                  <p className="no-comments">No comments yet</p>
                ) : (
                  post.comments.map((c, i) => (
                    <div key={i} className="comment">
                      <strong className="comment-author">{c.author}</strong>
                      <span className="comment-text">{c.text}</span>
                    </div>
                  ))
                )}
              </div>

              {/* ADD COMMENT */}
              <div className="comment-input-wrapper">
                <textarea
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows="2"
                />
                <button
                  className="send-comment-btn"
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

      </main>
      <nav className="bottom-nav">
  <button
    className={`nav-item ${activeTab === "feed" ? "active" : ""}`}
    onClick={() => setActiveTab("feed")}
  >
    Feed
  </button>

  <button
    className={`nav-item ${activeTab === "chat" ? "active" : ""}`}
    onClick={() => setActiveTab("chat")}
  >
    Live Chat
  </button>
</nav>


    </div>
    </div>
  );
};



export default FeedPage;
