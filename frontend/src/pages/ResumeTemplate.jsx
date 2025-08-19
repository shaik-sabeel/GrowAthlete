
// import React, { useEffect, useState, useRef } from "react";
// import api from "../utils/api";

// const ResumeTemplate = () => {
//   const [resume, setResume] = useState(null);
//   const resumeRef = useRef();

//   // Fetch resume data on mount
//   useEffect(() => {
//     const fetchResume = async () => {
//       try {
//         const res = await api.get(`/sports-resume/resData`);
//         setResume(res.data);
//       } catch (error) {
//         console.error("Error fetching resume:", error);
//       }
//     };
//     fetchResume();
//   }, []);

//   // Download handler
// //   const handleDownload = () => {
// //     const element = resumeRef.current;
// //     const opt = {
// //       margin: 0.5,
// //       filename: `${resume.fullName}_resume.pdf`,
// //       image: { type: "jpeg", quality: 0.98 },
// //       html2canvas: { scale: 2 },
// //       jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
// //     };
// //     window.html2pdf().set(opt).from(element).save();
// //   };


//  const handleDownload = () => {
//     if (resumeRef.current) {
//       window.$(resumeRef.current).printThis({
//         importCSS: true,
//         importStyle: true,
//         pageTitle: resume.fullName || "Resume",
//       });
//     }
//   };

//   if (!resume) {
//     return (
//       <div className="text-center py-20 text-gray-500">
//         Loading resume...
//       </div>
//     );
//   }

//   return (
//     <div id="btn" className="max-w-4xl mx-auto my-10">
//       {/* Download Button */}
//       <div className="flex justify-end mb-4">
//         <button
//           onClick={handleDownload}
//           className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition"
//         >
//           Download PDF
//         </button>
//       </div>

//       {/* Resume Box */}
//       <div
//         ref={resumeRef}
//         id="pdf"
//         className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
//       >
//         {/* Header Section */}
//         <div className="flex items-center bg-indigo-600 text-white p-5">
//           <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-md mr-5">
//             {resume.photo ? (
//               <img
//                 src={`http://localhost:5000/uploads/${resume.photo}`}
//                 alt="Profile"
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <div className="flex items-center justify-center w-full h-full bg-gray-300 text-gray-600">
//                 No Photo
//               </div>
//             )}
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold">{resume.fullName}</h1>
//             <p className="text-md">{resume.sport} Player</p>
//             <p className="text-sm">{resume.email} | {resume.phone}</p>
//           </div>
//         </div>

//         {/* Body */}
//         <div className="p-6 space-y-6">
//           {/* Personal Information */}
//           <section>
//             <h2 className="text-lg font-semibold border-b pb-1 mb-2">Personal Information</h2>
//             <p><strong>DOB:</strong> {new Date(resume.dob).toLocaleDateString()}</p>
//             <p><strong>Gender:</strong> {resume.gender}</p>
//             <p><strong>Nationality:</strong> {resume.nationality}</p>
//           </section>

//           {/* Athletic Details */}
//           <section>
//             <h2 className="text-lg font-semibold border-b pb-1 mb-2">Athletic Details</h2>
//             <p><strong>Sport:</strong> {resume.sport}</p>
//             <p><strong>Position:</strong> {resume.position}</p>
//             <p><strong>Height:</strong> {resume.height} cm</p>
//             <p><strong>Weight:</strong> {resume.weight} kg</p>
//             <p><strong>Dominant Side:</strong> {resume.dominantSide}</p>
//             <p><strong>Current Team:</strong> {resume.currentTeam}</p>
//           </section>

//           {/* Career Stats */}
//           <section>
//             <h2 className="text-lg font-semibold border-b pb-1 mb-2">Career Statistics</h2>
//             <p>{resume.careerStats || "No stats available"}</p>
//           </section>

//           {/* Skills */}
//           <section>
//             <h2 className="text-lg font-semibold border-b pb-1 mb-2">Skills & Attributes</h2>
//             <ul className="flex flex-wrap gap-2">
//               {resume.skills?.map((skill, i) => (
//                 <li
//                   key={i}
//                   className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
//                 >
//                   {skill}
//                 </li>
//               ))}
//             </ul>
//           </section>

//           {/* Achievements */}
//           <section>
//             <h2 className="text-lg font-semibold border-b pb-1 mb-2">Achievements</h2>
//             <ul className="list-disc ml-5 space-y-1">
//               {resume.achievements?.map((ach, i) => (
//                 <li key={i}>{ach}</li>
//               ))}
//             </ul>
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResumeTemplate;





import React, { useEffect, useState, useRef } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const ResumeTemplate = () => {
    const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const resumeRef = useRef();

  // Fetch resume data on mount
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await api.get(`/sports-resume/resData`);
        setResume(res.data);
      } catch (error) {
        console.error("Error fetching resume:", error);
      }
    };
    fetchResume();
  }, []);

  const handleDownload = async() => {
    if (resumeRef.current) {
      window.$(resumeRef.current).printThis({
        importCSS: true,
        importStyle: true,
        pageTitle: resume.fullName || "Resume",
      });
    }
    try {
        const res = await api.delete(`/sports-resume/resDel`);
        // setResume(res.data);
        // alert("Resume deleted successfully");
      } catch (error) {
        console.error("Error fetching resume:", error);
      }
  };

    const handleFillAgain = async() => { 
        navigate("/sports-resume");
        // Optionally, you can clear the resume state if needed
        setResume(null);
        try {
        const res = await api.delete(`/sports-resume/resDel`);
        // setResume(res.data);
        // alert("Resume deleted successfully");
      } catch (error) {
        console.error("Error fetching resume:", error);
      }
    }

  if (!resume) {
    return (
        <>
      <div className="text-center py-20 text-gray-500">
        Loading resume...
      </div>
      <div className="text-center py-20 text-gray-500">
      <button
          onClick={handleFillAgain}
          className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg shadow-md transition"
        >
          Fill the Form Again
        </button>
        </div>
        </>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-10">
      {/* Download Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleDownload}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition"
        >
          Download PDF
        </button>
        <button
          onClick={handleFillAgain}
          className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg shadow-md transition"
        >
          Fill the Form Again
        </button>
      </div>

      {/* Resume Box */}
      <div
        ref={resumeRef}
        id="pdf"
        className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
      >
        {/* Header Section */}
        <div className="flex items-center bg-indigo-600 text-white p-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md mr-6">
            {resume.photo ? (
              <img
                src={`http://localhost:5000/uploads/${resume.photo}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-300 text-gray-600">
                No Photo
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{resume.fullName}</h1>
            <p className="text-md">{resume.sport} Player</p>
            <p className="text-sm">{resume.email} | {resume.phone}</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          {/* Personal Information */}
          <section>
            <h2 className="text-xl font-semibold text-indigo-700 border-b-2 border-indigo-200 pb-1 mb-3">
              Personal Information
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><strong>DOB:</strong> {new Date(resume.dob).toLocaleDateString()}</p>
              <p><strong>Gender:</strong> {resume.gender}</p>
              <p><strong>Nationality:</strong> {resume.nationality}</p>
            </div>
          </section>

          {/* Athletic Details */}
          <section>
            <h2 className="text-xl font-semibold text-indigo-700 border-b-2 border-indigo-200 pb-1 mb-3">
              Athletic Details
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><strong>Sport:</strong> {resume.sport}</p>
              <p><strong>Position:</strong> {resume.position}</p>
              <p><strong>Height:</strong> {resume.height} cm</p>
              <p><strong>Weight:</strong> {resume.weight} kg</p>
              <p><strong>Dominant Side:</strong> {resume.dominantSide}</p>
              <p><strong>Current Team:</strong> {resume.currentTeam}</p>
            </div>
          </section>

          {/* Career Stats */}
          <section>
            <h2 className="text-xl font-semibold text-indigo-700 border-b-2 border-indigo-200 pb-1 mb-3">
              Career Statistics
            </h2>
            <p className="text-sm">{resume.careerStats || "No stats available"}</p>
          </section>

          {/* Skills */}
          <section>
            <h2 className="text-xl font-semibold text-indigo-700 border-b-2 border-indigo-200 pb-1 mb-3">
              Skills & Attributes
            </h2>
            <div className="flex flex-wrap gap-2">
              {resume.skills?.map((skill, i) => (
                <span
                  key={i}
                  className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Achievements */}
          <section>
            <h2 className="text-xl font-semibold text-indigo-700 border-b-2 border-indigo-200 pb-1 mb-3">
              Achievements
            </h2>
            <ul className="list-disc ml-6 space-y-1 text-sm">
              {resume.achievements?.map((ach, i) => (
                <li key={i}>{ach}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ResumeTemplate;
