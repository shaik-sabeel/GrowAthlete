
// import React, { useEffect, useState, useRef } from "react";
// import api from "../utils/api";
// import { useNavigate } from "react-router-dom";

// const ResumeTemplate = () => {
//   const navigate = useNavigate();
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

//   const handleDownload = async () => {
//     if (resumeRef.current) {
//       window.$(resumeRef.current).printThis({
//         importCSS: true,
//         importStyle: true,
//         pageTitle: resume.fullName || "Resume",
//       });
//     }
//     try {
//       await api.delete(`/sports-resume/resDel`);
//     } catch (error) {
//       console.error("Error deleting resume:", error);
//     }
//   };

//   const handleFillAgain = async () => {
//     navigate("/sports-resume");
//     setResume(null);
//     try {
//       await api.delete(`/sports-resume/resDel`);
//     } catch (error) {
//       console.error("Error deleting resume:", error);
//     }
//   };

//   if (!resume) {
//     return (
//       <>
//         <div className="text-center py-10 text-gray-600">Loading resume...</div>
//         <div className="text-center">
//           <button
//             onClick={handleFillAgain}
//             className="px-4 py-1 border border-gray-400 rounded hover:bg-gray-100"
//           >
//             Fill the Form Again
//           </button>
//         </div>
//       </>
//     );
//   }

//   return (
//     <div className="max-w-3xl mx-auto my-8">
//       {/* Action Buttons */}
//       <div className="flex justify-end gap-2 mb-4">
//         <button
//           onClick={handleDownload}
//           className="px-4 py-1 border border-black rounded hover:bg-gray-100"
//         >
//           Download
//         </button>
//         <button
//           onClick={handleFillAgain}
//           className="px-4 py-1 border border-black rounded hover:bg-gray-100"
//         >
//           Fill the Form Again
//         </button>
//       </div>

//       {/* Resume Content */}
//       <div ref={resumeRef} className="bg-white text-black border p-6">
//         {/* Header */}
//         <div className="mb-4">
//           {resume.profileImage && (
//             <img
//               src={`${import.meta.env.VITE_API_BASE_URL || 'https://growathlete-1.onrender.com'}/uploads/${resume.profileImage}`}
//               alt="Profile"
//               className="w-28 h-28 object-cover border mb-3"
//             />
//           )}
//           <h1 className="text-2xl font-bold">{resume.fullName}</h1>
//           <p>{resume.primarySport}</p>
//           <p>{resume.email} | {resume.phone}</p>
//         </div>

//         {/* Personal Information */}
//         <div className="mb-4">
//           <h2 className="font-semibold underline">Personal Information</h2>
//           <p><strong>Date of Birth:</strong> {resume.dateOfBirth ? new Date(resume.dateOfBirth).toLocaleDateString() : "—"}</p>
//           <p><strong>Gender:</strong> {resume.gender || "—"}</p>
//           <p><strong>Nationality:</strong> {resume.nationality || "—"}</p>
//           <p><strong>Address:</strong> {resume.address || "—"}</p>
//         </div>

//         {/* Athletic Details */}
//         <div className="mb-4">
//           <h2 className="font-semibold underline">Athletic Details</h2>
//           <p><strong>Sport:</strong> {resume.primarySport || "—"}</p>
//           <p><strong>Position:</strong> {resume.position || "—"}</p>
//           <p><strong>Height:</strong> {resume.height ? `${resume.height} cm` : "—"}</p>
//           <p><strong>Weight:</strong> {resume.weight ? `${resume.weight} kg` : "—"}</p>
//           <p><strong>Dominant Hand:</strong> {resume.dominantHand || "—"}</p>
//           <p><strong>Current Team:</strong> {resume.currentTeam || "—"}</p>
//         </div>

//         {/* Education */}
//         <div className="mb-4">
//           <h2 className="font-semibold underline">Education</h2>
//           <p>{resume.education || "—"}</p>
//         </div>

//         {/* Career Stats */}
//         <div className="mb-4">
//           <h2 className="font-semibold underline">Career Statistics</h2>
//           <p>{resume.careerStats || "—"}</p>
//         </div>

//         {/* Skills */}
//         <div className="mb-4">
//           <h2 className="font-semibold underline">Skills</h2>
//           {resume.skills && resume.skills.length > 0 ? (
//             <ul className="list-disc ml-6">
//               {resume.skills.map((s, i) => <li key={i}>{s}</li>)}
//             </ul>
//           ) : <p>—</p>}
//         </div>

//         {/* Achievements */}
//         <div className="mb-4">
//           <h2 className="font-semibold underline">Achievements</h2>
//           {resume.achievements && resume.achievements.length > 0 ? (
//             <ul className="list-disc ml-6">
//               {resume.achievements.map((a, i) => <li key={i}>{a}</li>)}
//             </ul>
//           ) : <p>—</p>}
//         </div>

//         {/* Tournaments */}
//         <div className="mb-4">
//           <h2 className="font-semibold underline">Tournaments</h2>
//           {resume.tournaments && resume.tournaments.length > 0 ? (
//             <ul className="list-disc ml-6">
//               {resume.tournaments.map((t, i) => <li key={i}>{t}</li>)}
//             </ul>
//           ) : <p>—</p>}
//         </div>

//         {/* References */}
//         <div className="mb-4">
//           <h2 className="font-semibold underline">References</h2>
//           {resume.references && resume.references.length > 0 ? (
//             <ul className="list-disc ml-6">
//               {resume.references.map((r, i) => <li key={i}>{r}</li>)}
//             </ul>
//           ) : <p>—</p>}
//         </div>

//         {/* Certifications */}
//         <div className="mb-4">
//           <h2 className="font-semibold underline">Certifications</h2>
//           {resume.certifications && resume.certifications.length > 0 ? (
//             <ul className="list-disc ml-6">
//               {resume.certifications.map((c, i) => <li key={i}>{c}</li>)}
//             </ul>
//           ) : <p>—</p>}
//         </div>

//         {/* Video Links */}
//         <div className="mb-4">
//           <h2 className="font-semibold underline">Video Links</h2>
//           {resume.videoLinks && resume.videoLinks.length > 0 ? (
//             <ul className="list-disc ml-6">
//               {resume.videoLinks.map((v, i) => (
//                 <li key={i}>
//                   <a href={v} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
//                     {v}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           ) : <p>—</p>}
//         </div>

//         {/* Social Media */}
//         <div className="mb-4">
//           <h2 className="font-semibold underline">Social Media</h2>
//           {resume.socialMedia && resume.socialMedia.length > 0 ? (
//             <ul className="list-disc ml-6">
//               {resume.socialMedia.map((sm, i) => (
//                 <li key={i}>
//                   <a href={sm} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
//                     {sm}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           ) : <p>—</p>}
//         </div>

//         <p className="text-xs text-gray-500">Created At: {new Date(resume.createdAt).toLocaleDateString()}</p>
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

  const handleDownload = async () => {
    if (resumeRef.current) {
      window.$(resumeRef.current).printThis({
        importCSS: true,
        importStyle: true,
        pageTitle: resume.fullName || "Resume",
      });
    }
    try {
      await api.delete(`/sports-resume/resDel`);
    } catch (error) {
      console.error("Error deleting resume:", error);
    }
  };

  const handleFillAgain = async () => {
    navigate("/sports-resume");
    setResume(null);
    try {
      await api.delete(`/sports-resume/resDel`);
    } catch (error) {
      console.error("Error deleting resume:", error);
    }
  };

  if (!resume) {
    return (
      <>
        <div className="text-center py-10 text-gray-600">Loading resume...</div>
        <div className="text-center">
          <button
            onClick={handleFillAgain}
            className="px-4 py-1 border border-gray-400 rounded hover:bg-gray-100"
          >
            Fill the Form Again
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-4 sm:my-8 px-4 sm:px-6 lg:px-8">
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mb-4">
        <button
          onClick={handleDownload}
          className="px-4 py-2 sm:py-1 border border-black rounded hover:bg-gray-100 text-sm sm:text-base font-medium transition-colors"
        >
          Download
        </button>
        <button
          onClick={handleFillAgain}
          className="px-4 py-2 sm:py-1 border border-black rounded hover:bg-gray-100 text-sm sm:text-base font-medium transition-colors"
        >
          Fill the Form Again
        </button>
      </div>

      {/* Resume Content */}
      <div ref={resumeRef} className="bg-white text-black border p-4 sm:p-6 lg:p-8 leading-relaxed shadow-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start border-b pb-4 mb-6 gap-4">
          {resume.profileImage && (
            <img
              src={`${import.meta.env.VITE_API_BASE_URL || 'https://growathlete-1.onrender.com'}/uploads/${resume.profileImage}`}
              alt="Profile"
              className="w-24 h-24 sm:w-28 sm:h-28 object-cover border rounded-full sm:rounded-none sm:mr-6 flex-shrink-0"
            />
          )}
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">{resume.fullName}</h1>
            <p className="text-base sm:text-lg text-gray-700 mb-1">{resume.primarySport}</p>
            <p className="text-sm sm:text-base text-gray-600 break-all sm:break-normal">{resume.email}</p>
            <p className="text-sm sm:text-base text-gray-600">{resume.phone}</p>
          </div>
        </div>

        {/* Two-column info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-6">
          {/* Personal Info */}
          <div>
            <h2 className="font-semibold border-b mb-3 text-lg">Personal Information</h2>
            <div className="space-y-2 text-sm sm:text-base">
              <p><strong>Date of Birth:</strong> {resume.dateOfBirth ? new Date(resume.dateOfBirth).toLocaleDateString() : "—"}</p>
              <p><strong>Gender:</strong> {resume.gender || "—"}</p>
              <p><strong>Nationality:</strong> {resume.nationality || "—"}</p>
              <p><strong>Address:</strong> <span className="break-words">{resume.address || "—"}</span></p>
            </div>
          </div>

          {/* Athletic Details */}
          <div>
            <h2 className="font-semibold border-b mb-3 text-lg">Athletic Details</h2>
            <div className="space-y-2 text-sm sm:text-base">
              <p><strong>Sport:</strong> {resume.primarySport || "—"}</p>
              <p><strong>Position:</strong> {resume.position || "—"}</p>
              <p><strong>Height:</strong> {resume.height ? `${resume.height} cm` : "—"}</p>
              <p><strong>Weight:</strong> {resume.weight ? `${resume.weight} kg` : "—"}</p>
              <p><strong>Dominant Hand:</strong> {resume.dominantHand || "—"}</p>
              <p><strong>Current Team:</strong> {resume.currentTeam || "—"}</p>
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="mb-6">
          <h2 className="font-semibold border-b mb-3 text-lg">Education</h2>
          <p className="text-sm sm:text-base whitespace-pre-wrap break-words">{resume.education || "—"}</p>
        </div>

        {/* Career Stats */}
        <div className="mb-6">
          <h2 className="font-semibold border-b mb-3 text-lg">Career Statistics</h2>
          <p className="text-sm sm:text-base whitespace-pre-wrap break-words">{resume.careerStats || "—"}</p>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h2 className="font-semibold border-b mb-3 text-lg">Skills</h2>
          {resume.skills?.length ? (
            <ul className="list-disc ml-4 sm:ml-6 space-y-1 text-sm sm:text-base">
              {resume.skills.map((s, i) => <li key={i} className="break-words">{s}</li>)}
            </ul>
          ) : <p className="text-sm sm:text-base">—</p>}
        </div>

        {/* Achievements */}
        <div className="mb-6">
          <h2 className="font-semibold border-b mb-3 text-lg">Achievements</h2>
          {resume.achievements?.length ? (
            <ul className="list-disc ml-4 sm:ml-6 space-y-1 text-sm sm:text-base">
              {resume.achievements.map((a, i) => <li key={i} className="break-words">{a}</li>)}
            </ul>
          ) : <p className="text-sm sm:text-base">—</p>}
        </div>

        {/* Tournaments */}
        <div className="mb-6">
          <h2 className="font-semibold border-b mb-3 text-lg">Tournaments</h2>
          {resume.tournaments?.length ? (
            <ul className="list-disc ml-4 sm:ml-6 space-y-1 text-sm sm:text-base">
              {resume.tournaments.map((t, i) => <li key={i} className="break-words">{t}</li>)}
            </ul>
          ) : <p className="text-sm sm:text-base">—</p>}
        </div>

        {/* References */}
        <div className="mb-6">
          <h2 className="font-semibold border-b mb-3 text-lg">References</h2>
          {resume.references?.length ? (
            <ul className="list-disc ml-4 sm:ml-6 space-y-1 text-sm sm:text-base">
              {resume.references.map((r, i) => <li key={i} className="break-words">{r}</li>)}
            </ul>
          ) : <p className="text-sm sm:text-base">—</p>}
        </div>

        {/* Certifications */}
        <div className="mb-6">
          <h2 className="font-semibold border-b mb-3 text-lg">Certifications</h2>
          {resume.certifications?.length ? (
            <ul className="list-disc ml-4 sm:ml-6 space-y-1 text-sm sm:text-base">
              {resume.certifications.map((c, i) => <li key={i} className="break-words">{c}</li>)}
            </ul>
          ) : <p className="text-sm sm:text-base">—</p>}
        </div>

        {/* Video Links */}
        <div className="mb-6">
          <h2 className="font-semibold border-b mb-3 text-lg">Video Links</h2>
          {resume.videoLinks?.length ? (
            <ul className="list-disc ml-4 sm:ml-6 space-y-1 text-sm sm:text-base">
              {resume.videoLinks.map((v, i) => (
                <li key={i} className="break-all">
                  <a href={v} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
                    {v}
                  </a>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm sm:text-base">—</p>}
        </div>

        {/* Social Media */}
        <div className="mb-6">
          <h2 className="font-semibold border-b mb-2">Social Media</h2>
          {resume.socialMedia?.length ? (
            <ul className="list-disc ml-6 space-y-1">
              {resume.socialMedia.map((sm, i) => (
                <li key={i}>
                  <a href={sm} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    {sm}
                  </a>
                </li>
              ))}
            </ul>
          ) : <p>—</p>}
        </div>

        <p className="text-xs text-gray-500">Created At: {new Date(resume.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default ResumeTemplate;
