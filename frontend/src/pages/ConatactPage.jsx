
// import React, { useState } from "react";
// import axios from "axios";  // 👈 import axios
// import BgImg from "../assets/contus_bg2.jpg";
// import api from "../utils/api";
// import '../pages_css/contact.css'
// import Navbar from "../components/Navbar"; 

// const ContactPage = () => {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     message: "",
//   });

//   // Handle input change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Handle form submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await api.post("/contact", formData);

//       if (res.status === 200) {
//         alert("Message sent successfully ✅");
//         setFormData({
//           firstName: "",
//           lastName: "",
//           email: "",
//           message: "",
//         });
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       alert("Failed to send ❌");
//     }
//   };

//   return (
//     <>
//     <Navbar />
//     <div
//       className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center"
//       style={{ backgroundImage: `url(${BgImg})` }}
//     >
//       <div className="relative z-10 p-10 rounded-2xl shadow-2xl flex flex-col lg:flex-row gap-10 max-w-6xl w-full bg-white/5 backdrop-blur-md border border-white/20 animate-fade-in-up ">
//         {/* Left Section: Fill the form */}
//         <div className="flex-1 p-6 text-gray-200">
//           {/* <h2 className="text-3xl lg:text-4xl font-bold mb-8 animate-slide-in-left text-yellow-400">
//             Fill the form
//           </h2> */}

//           <h2 className="text-3xl lg:text-4xl font-bold mb-8 animate-slide-in-left style" style={{color:"white"}}>
//   Fill the form
// </h2>


//           {/* Floating label inputs */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//             <div className="relative">
//               <input
//                 type="text"
//                 id="first-name"
//                 name="first-name"
//                 className="peer block w-full px-4 py-3 bg-white/10 border border-purple-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-transparent"
//                 placeholder="John"
//               />
//               <label
//                 htmlFor="first-name"
//                 className="absolute left-3 -top-2.5 text-sm text-purple-300 bg-black/50 px-1 rounded transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base"
//               >
//                 First Name
//               </label>
//             </div>
//             <div className="relative">
//               <input
//                 type="text"
//                 id="last-name"
//                 name="last-name"
//                 className="peer block w-full px-4 py-3 bg-white/10 border border-purple-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-transparent"
//                 placeholder="Doe"
//               />
//               <label
//                 htmlFor="last-name"
//                 className="absolute left-3 -top-2.5 text-sm text-purple-300 bg-black/50 px-1 rounded transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base"
//               >
//                 Last Name
//               </label>
//             </div>
//           </div>

//           <div className="relative mb-6">
//             <input
//               type="email"
//               id="email"
//               name="email"
//               className="peer block w-full px-4 py-3 bg-white/10 border border-purple-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-transparent"
//               placeholder="you@example.com"
//             />
//             <label
//               htmlFor="email"
//               className="absolute left-3 -top-2.5 text-sm text-purple-300 bg-black/50 px-1 rounded transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base"
//             >
//               Email Address
//             </label>
//           </div>

//           <div className="relative mb-8">
//             <textarea
//               id="message"
//               name="message"
//               rows="5"
//               className="peer block w-full px-4 py-3 bg-white/10 border border-purple-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-transparent resize-y"
//               placeholder="Your message here..."
//             ></textarea>
//             <label
//               htmlFor="message"
//               className="absolute left-3 -top-2.5 text-sm text-purple-300 bg-black/50 px-1 rounded transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base"
//             >
//               Message
//             </label>
//           </div>

//           <button
//             type="submit"
//             className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 transform hover:scale-105"
//           >
//             Submit
//           </button>
//         </div>

//         {/* Right Section: Get in Touch */}
//         <div className="flex-1 p-6 text-white flex flex-col justify-center animate-slide-in-right">
//           <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 text-purple-200" style={{color:"white"}}>
//             Get in Touch.
//           </h2>

//           <div className="space-y-6">
//             {[
//               { icon: "✉️", title: "Email", value: "growathlete.info@gmail.com" },
//             //   { icon: "🌐", title: "Website", value: "reallygreatsite.com" },
//               { icon: "📞", title: "Phone", value: "+91 8500767368" },
//               { icon: "📍", title: "Location", value: "Hyderabad, Telangana" },
//             ].map((item, i) => (
//               <div
//                 key={i}
//                 className="flex items-start gap-4 transform transition hover:scale-105"
//               >
//                 <span className="text-purple-400 text-3xl animate-bounce">
//                   {item.icon}
//                 </span>
//                 <div>
//                   <p className="font-semibold text-lg text-white">
//                     {item.title}
//                   </p>
//                   {item.title === "Email" ? (
//                     <a
//                       href={`mailto:${item.value}`}
//                       className="text-purple-300 hover:text-purple-100"
//                     >
//                       {item.value}
//                     </a>
//                   ) : item.title === "Website" ? (
//                     <a
//                       href={`http://${item.value}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-purple-300 hover:text-purple-100"
//                     >
//                       {item.value}
//                     </a>
//                   ) : (
//                     <p className="text-black px-6">{item.value}</p>
//                   )}
//                 </div>
//               </div>
//               <div className="relative">
//                 <input
//                   type="text"
//                   id="last-name"
//                   name="lastName"
//                   value={formData.lastName}
//                   onChange={handleChange}
//                   className="peer block w-full px-4 py-3 bg-white/10 border border-purple-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-transparent"
//                   placeholder="Doe"
//                   required
//                 />
//                 <label
//                   htmlFor="last-name"
//                   className="absolute left-3 -top-2.5 text-sm text-purple-300 bg-black/50 px-1 rounded transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base"
//                 >
//                   Last Name
//                 </label>
//               </div>
//             </div>

//             <div className="relative mb-6">
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="peer block w-full px-4 py-3 bg-white/10 border border-purple-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-transparent"
//                 placeholder="you@example.com"
//                 required
//               />
//               <label
//                 htmlFor="email"
//                 className="absolute left-3 -top-2.5 text-sm text-purple-300 bg-black/50 px-1 rounded transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base"
//               >
//                 Email Address
//               </label>
//             </div>

//             <div className="relative mb-8">
//               <textarea
//                 id="message"
//                 name="message"
//                 rows="5"
//                 value={formData.message}
//                 onChange={handleChange}
//                 className="peer block w-full px-4 py-3 bg-white/10 border border-purple-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-transparent resize-y"
//                 placeholder="Your message here..."
//                 required
//               ></textarea>
//               <label
//                 htmlFor="message"
//                 className="absolute left-3 -top-2.5 text-sm text-purple-300 bg-black/50 px-1 rounded transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base"
//               >
//                 Message
//               </label>
//             </div>

//             <button
//               type="submit"
//               className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 transform hover:scale-105"
//             >
//               Submit
//             </button>
//           </form>
//         </div>

//         {/* Right Section... (unchanged) */}
//       </div>
//     </div>
//     </>
//   );
// };

// export default ContactPage;


import React, { useState } from "react";
import axios from "axios";  // 👈 import axios
import BgImg from "../assets/contus_bg.jpg";
import api from "../utils/api";
import '../pages_css/contact.css'
import Navbar from "../components/Navbar"; 

const ContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/contact", formData);

      if (res.status === 200) {
        alert("Message sent successfully ✅");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          message: "",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to send ❌");
    }
  };

  return (
    <>
    <Navbar />
    <div
      className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center"
      style={{ backgroundImage: `url(${BgImg})` }}
    >
      <div className="relative z-10 p-10 rounded-2xl shadow-2xl flex flex-col lg:flex-row gap-10 max-w-6xl w-full bg-white/5 backdrop-blur-md border border-white/20 animate-fade-in-up ">
        {/* Left Section: Fill the form */}
        <div className="flex-1 p-6 text-gray-200">
          <h2 className="text-3xl lg:text-4xl font-bold mb-8 animate-slide-in-left ">
            Fill the form
          </h2>

          {/* 👇 added onSubmit here */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="relative">
                <input
                  type="text"
                  id="first-name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="peer block w-full px-4 py-3 bg-white/10 border border-purple-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-transparent"
                  placeholder="John"
                  required
                />
                <label
                  htmlFor="first-name"
                  className="absolute left-3 -top-2.5 text-sm text-purple-300 bg-black/50 px-1 rounded transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base"
                >
                  First Name
                </label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  id="last-name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="peer block w-full px-4 py-3 bg-white/10 border border-purple-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-transparent"
                  placeholder="Doe"
                  required
                />
                <label
                  htmlFor="last-name"
                  className="absolute left-3 -top-2.5 text-sm text-purple-300 bg-black/50 px-1 rounded transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base"
                >
                  Last Name
                </label>
              </div>
            </div>

            <div className="relative mb-6">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="peer block w-full px-4 py-3 bg-white/10 border border-purple-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-transparent"
                placeholder="you@example.com"
                required
              />
              <label
                htmlFor="email"
                className="absolute left-3 -top-2.5 text-sm text-purple-300 bg-black/50 px-1 rounded transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base"
              >
                Email Address
              </label>
            </div>

            <div className="relative mb-8">
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                className="peer block w-full px-4 py-3 bg-white/10 border border-purple-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-transparent resize-y"
                placeholder="Your message here..."
                required
              ></textarea>
              <label
                htmlFor="message"
                className="absolute left-3 -top-2.5 text-sm text-purple-300 bg-black/50 px-1 rounded transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base"
              >
                Message
              </label>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 transform hover:scale-105"
            >
              Submit
            </button>
          </form>
        </div>
         {/* Right Section: Get in Touch */}
        <div className="flex-1 p-6 text-white flex flex-col justify-center animate-slide-in-right">
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 text-yellow-400 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
            Get in Touch.
          </h2>
          <p className="text-purple-300 text-lg mb-8">
            Whether you have questions about our services, need support, or want to share your feedback, our dedicated
            team is here to assist you every step of the way.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <span className="text-purple-400 text-3xl">✉</span>
              <div>
                <p className="font-semibold text-lg text-purple-200">Email</p>
                <a href="mailto:hello@reallygreatsite.com" className="text-purple-300 hover:text-purple-100 transition-colors">
                  hello@reallygreatsite.com
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-purple-400 text-3xl">🌐</span>
              <div>
                <p className="font-semibold text-lg text-purple-200">Website</p>
                <a href="http://reallygreatsite.com" target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:text-purple-100 transition-colors">
                  reallygreatsite.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-purple-400 text-3xl">📞</span>
              <div>
                <p className="font-semibold text-lg text-purple-200">Phone</p>
                <p className="text-purple-300">+123-456-7890</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-purple-400 text-3xl">📍</span>
              <div>
                <p className="font-semibold text-lg text-purple-200">Location</p>
                <p className="text-purple-300">123 Anywhere St., Any City</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Section... (unchanged) */}
      </div>
    </div>
    </>
  );
};

export default ContactPage;
