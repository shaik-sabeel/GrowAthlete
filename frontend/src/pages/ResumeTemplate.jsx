
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
//               src={`https://growathlete.onrender.com/uploads/${resume.profileImage}`}
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
    <div className="max-w-4xl mx-auto my-8">
      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mb-4">
        <button
          onClick={handleDownload}
          className="px-4 py-1 border border-black rounded hover:bg-gray-100"
        >
          Download
        </button>
        <button
          onClick={handleFillAgain}
          className="px-4 py-1 border border-black rounded hover:bg-gray-100"
        >
          Fill the Form Again
        </button>
      </div>

      {/* Resume Content */}
      <div ref={resumeRef} className="bg-white text-black border p-8 leading-relaxed">
        {/* Header */}
        <div className="flex items-center border-b pb-4 mb-6">
          {resume.profileImage && (
            <img
              src={`https://growathlete.onrender.com/uploads/${resume.profileImage}`}
              alt="Profile"
              className="w-28 h-28 object-cover border mr-6"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold">{resume.fullName}</h1>
            <p className="text-lg">{resume.primarySport}</p>
            <p>{resume.email} | {resume.phone}</p>
          </div>
        </div>

        {/* Two-column info */}
        <div className="grid grid-cols-2 gap-8 mb-6">
          {/* Personal Info */}
          <div>
            <h2 className="font-semibold border-b mb-2">Personal Information</h2>
            <p><strong>Date of Birth:</strong> {resume.dateOfBirth ? new Date(resume.dateOfBirth).toLocaleDateString() : "—"}</p>
            <p><strong>Gender:</strong> {resume.gender || "—"}</p>
            <p><strong>Nationality:</strong> {resume.nationality || "—"}</p>
            <p><strong>Address:</strong> {resume.address || "—"}</p>
          </div>

          {/* Athletic Details */}
          <div>
            <h2 className="font-semibold border-b mb-2">Athletic Details</h2>
            <p><strong>Sport:</strong> {resume.primarySport || "—"}</p>
            <p><strong>Position:</strong> {resume.position || "—"}</p>
            <p><strong>Height:</strong> {resume.height ? `${resume.height} cm` : "—"}</p>
            <p><strong>Weight:</strong> {resume.weight ? `${resume.weight} kg` : "—"}</p>
            <p><strong>Dominant Hand:</strong> {resume.dominantHand || "—"}</p>
            <p><strong>Current Team:</strong> {resume.currentTeam || "—"}</p>
          </div>
        </div>

        {/* Education */}
        <div className="mb-6">
          <h2 className="font-semibold border-b mb-2">Education</h2>
          <p>{resume.education || "—"}</p>
        </div>

        {/* Career Stats */}
        <div className="mb-6">
          <h2 className="font-semibold border-b mb-2">Career Statistics</h2>
          <p>{resume.careerStats || "—"}</p>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h2 className="font-semibold border-b mb-2">Skills</h2>
          {resume.skills?.length ? (
            <ul className="list-disc ml-6 space-y-1">
              {resume.skills.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          ) : <p>—</p>}
        </div>

        {/* Achievements */}
        <div className="mb-6">
          <h2 className="font-semibold border-b mb-2">Achievements</h2>
          {resume.achievements?.length ? (
            <ul className="list-disc ml-6 space-y-1">
              {resume.achievements.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          ) : <p>—</p>}
        </div>

        {/* Tournaments */}
        <div className="mb-6">
          <h2 className="font-semibold border-b mb-2">Tournaments</h2>
          {resume.tournaments?.length ? (
            <ul className="list-disc ml-6 space-y-1">
              {resume.tournaments.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          ) : <p>—</p>}
        </div>

        {/* References */}
        <div className="mb-6">
          <h2 className="font-semibold border-b mb-2">References</h2>
          {resume.references?.length ? (
            <ul className="list-disc ml-6 space-y-1">
              {resume.references.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          ) : <p>—</p>}
        </div>

        {/* Certifications */}
        <div className="mb-6">
          <h2 className="font-semibold border-b mb-2">Certifications</h2>
          {resume.certifications?.length ? (
            <ul className="list-disc ml-6 space-y-1">
              {resume.certifications.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          ) : <p>—</p>}
        </div>

        {/* Video Links */}
        <div className="mb-6">
          <h2 className="font-semibold border-b mb-2">Video Links</h2>
          {resume.videoLinks?.length ? (
            <ul className="list-disc ml-6 space-y-1">
              {resume.videoLinks.map((v, i) => (
                <li key={i}>
                  <a href={v} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    {v}
                  </a>
                </li>
              ))}
            </ul>
          ) : <p>—</p>}
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
