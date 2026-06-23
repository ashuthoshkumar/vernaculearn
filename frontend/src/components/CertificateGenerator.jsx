import React, { useRef, useState } from 'react';
import jsPDF from 'jsPDF';
import html2canvas from 'html2canvas';

const CertificateGenerator = ({ studentName, courseName }) => {
  const certificateRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    const element = certificateRef.current;
    
    try {
      // 1. Capture the hidden high-res layout
      const canvas = await html2canvas(element, {
        scale: 2, // Forces crisp, sharp text renders
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');

      // 2. Set up landscape A4 PDF dimensions 
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      // A4 dimensions at 72 dpi = 297mm x 210mm
      pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
      
      // 3. Trigger download file
      const formattedCourseName = courseName ? courseName.replace(/\s+/g, '_') : 'Course';
      pdf.save(`Certificate_${formattedCourseName}.pdf`);
    } catch (error) {
      console.error("Error generating certificate PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Format today's date neatly
  const formattedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col items-center justify-center">
      
      {/* Visual Button Trigger */}
      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className={`px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl shadow-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center gap-2 ${
          isGenerating ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Generating Document...
          </>
        ) : (
          <>
            <span>🎓</span> Claim Official Certificate
          </>
        )}
      </button>

      {/* Hidden Certificate Node (Rendered completely offscreen to keep app UI clean) */}
      <div className="absolute left-[-9999px] top-[-9999px] overflow-hidden">
        <div
          ref={certificateRef}
          style={{ width: '1123px', height: '794px' }}
          className="relative bg-white text-slate-800 p-16 flex flex-col justify-between items-center border-[20px] border-double border-emerald-600 box-border select-none"
        >
          {/* Elegant Thin Inner Geometric Border */}
          <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-emerald-700/20 pointer-events-none" />
          
          {/* Top Branding Section */}
          <div className="text-center mt-6">
            <h1 className="text-5xl font-serif tracking-[0.15em] text-emerald-800 font-extrabold mb-3">
              VERNACULEARN
            </h1>
            <div className="h-[2px] w-48 bg-gradient-to-r from-transparent via-emerald-600 to-transparent mx-auto mb-2" />
            <p className="text-xs tracking-[0.25em] text-slate-400 uppercase font-bold">
              Verified Certificate of Completion
            </p>
          </div>

          {/* Main Recipient Details */}
          <div className="text-center max-w-3xl flex flex-col items-center">
            <p className="text-lg text-slate-400 italic font-serif mb-6">
              This acknowledgment is proudly presented to
            </p>
            <h2 className="text-5xl font-serif font-black text-slate-900 border-b-2 border-slate-200 pb-3 px-16 min-w-[450px] tracking-wide capitalize">
              {studentName || 'Valued Learner'}
            </h2>
            <p className="text-base text-slate-500 mt-8 max-w-xl leading-relaxed">
              for successfully executing, reviewing, and completing all required instructional modules, interactive projects, and assessments for the online curriculum path:
            </p>
            <h3 className="text-3xl font-sans font-bold text-emerald-600 mt-4 tracking-wide">
              {courseName || 'Advanced Course Path'}
            </h3>
          </div>

          {/* Bottom Trust & Validation Metadata Footer */}
          <div className="w-full flex justify-between items-end px-16 mb-6">
            
            {/* Signature Block */}
            <div className="text-center w-48">
              <p className="text-xl font-serif font-semibold text-emerald-800 border-b border-slate-300 pb-2 italic tracking-wide">
                VernacuLearn AI
              </p>
              <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 mt-2 font-bold">
                Authorized Issuer
              </p>
            </div>

            {/* Central Security Seal Display Graphic */}
            <div className="relative w-24 h-24 bg-gradient-to-br from-amber-50 to-amber-100 rounded-full border-4 border-emerald-600 flex items-center justify-center shadow-md">
              <div className="absolute inset-2 border-2 border-dashed border-emerald-600/40 rounded-full" />
              <span className="text-4xl filter drop-shadow">🏅</span>
            </div>

            {/* Issuance Date Block */}
            <div className="text-center w-48">
              <p className="text-base font-sans font-semibold text-slate-800 border-b border-slate-300 pb-[11px] tracking-wide">
                {formattedDate}
              </p>
              <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 mt-2 font-bold">
                Date of Issuance
              </p>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default CertificateGenerator;