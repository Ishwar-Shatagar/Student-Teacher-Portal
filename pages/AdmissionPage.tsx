import React from 'react';
import * as Icons from '../components/common/Icons';

const AdmissionPage: React.FC = () => {
    const collegeName = "BLDEA’s V.P. Dr. P.G. Halakatti College of Engineering and Technology";
    const collegeAddress = "Ashram Rd, Adarsh Nagar, Vijayapura, Karnataka 586103";
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${collegeName}, ${collegeAddress}`)}`;
    const googleMapsEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3821.841571219971!2d75.72919931535787!3d16.8299109839958!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc655767a904221%3A0x100bed5e54407519!2sBLDEA's%20V.%20P.%20Dr.%20P.%20G.%20Halakatti%20College%20of%20Engineering%20and%20Technology!5e0!3m2!1sen!2sin";


    const PolicySection: React.FC<{ id: string; title: string; children: React.ReactNode }> = ({ id, title, children }) => (
        <section id={id} className="mb-8">
            <h3 className="text-2xl font-bold text-black dark:text-gray-100 mb-4 pb-2 border-b border-gray-300 dark:border-white/20">{title}</h3>
            <div className="prose dark:prose-invert max-w-none">
                {children}
            </div>
        </section>
    );

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <div className="glass-card p-6 sm:p-8 mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-black dark:text-white">Admissions</h1>
                <p className="mt-2 text-black dark:text-gray-300">Your future in AI &amp; Machine Learning starts here. Explore our policies and apply today.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Left Column: Admission Policy */}
                <div className="lg:col-span-3 glass-card p-6 sm:p-8">
                    <h2 className="text-3xl font-bold text-black dark:text-white mb-6">Admission Policy 2025-2026</h2>
                    
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <a 
                            href="https://www.bldeacet.ac.in/" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            title="Click to apply online" 
                            className="flex-1 text-center px-6 py-3 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-primary-500 transition-all duration-300 shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/40 transform hover:-translate-y-1">
                            Apply Online. Free!
                        </a>
                         <a href="/brochure.pdf" download className="flex-1 text-center px-6 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-lg hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
                            Download Brochure
                        </a>
                    </div>

                    <PolicySection id="process" title="Application Process">
                        <p className="text-black dark:text-gray-300">Our admission process is designed to be straightforward and transparent. Follow these steps to join our esteemed institution:</p>
                        <ol className="text-black dark:text-gray-300">
                            <li><strong>Online Application:</strong> Complete the online application form available on our official website. Ensure all details are accurate and upload the required documents.</li>
                            <li><strong>Entrance Examination:</strong> Eligible candidates will be required to appear for the college's entrance examination or provide valid scores from state/national level tests (e.g., KCET, COMEDK).</li>
                            <li><strong>Merit List & Counseling:</strong> A merit list will be published based on entrance exam scores and academic performance. Shortlisted candidates will be called for counseling.</li>
                            <li><strong>Final Admission:</strong> Admission is confirmed upon verification of documents and payment of the admission fees.</li>
                        </ol>
                    </PolicySection>

                    <PolicySection id="documents" title="Documents Required">
                        <p className="text-black dark:text-gray-300">Please prepare the following documents (original and two sets of photocopies) for verification during counseling:</p>
                        <ul className="text-black dark:text-gray-300">
                            <li>SSLC / 10th Standard Marks Card</li>
                            <li>PUC / 12th Standard Marks Card</li>
                            <li>Entrance Exam Scorecard (KCET/COMEDK, etc.)</li>
                            <li>Transfer Certificate (TC) from the last institution attended</li>
                            <li>Study Certificate and Character Certificate</li>
                            <li>Migration Certificate (for students outside Karnataka)</li>
                            <li>Passport-sized photographs (6 copies)</li>
                            <li>Aadhaar Card</li>
                        </ul>
                    </PolicySection>
                </div>

                {/* Right Column: Contact & Map */}
                <div className="lg:col-span-2 space-y-8">
                    <div id="contact-info" className="glass-card p-6">
                        <h3 className="text-2xl font-bold text-black dark:text-white mb-4">Contact Information</h3>
                        <div className="space-y-4 text-black dark:text-gray-300">
                             <div className="flex items-start gap-3">
                                <Icons.LocationMarkerIcon className="w-5 h-5 mt-1 text-primary-400 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-black dark:text-white">{collegeName}</h4>
                                    <p className="text-sm text-black dark:text-gray-300">{collegeAddress}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3"><Icons.PhoneIcon className="w-5 h-5 text-primary-400" /> <span>08352-261120</span></div>
                            <div className="flex items-center gap-3"><Icons.FaxIcon className="w-5 h-5 text-primary-400" /> <span>08352-262945</span></div>
                            <div className="flex items-center gap-3"><Icons.EmailIcon className="w-5 h-5 text-primary-400" /> <a href="mailto:principal@bldeacet.ac.in" className="text-black dark:text-gray-300 hover:underline">principal@bldeacet.ac.in</a></div>
                            <div className="flex items-center gap-3"><Icons.WebsiteIcon className="w-5 h-5 text-primary-400" /> <a href="https://bldeacet.ac.in" target="_blank" rel="noopener noreferrer" className="text-black dark:text-gray-300 hover:underline">bldeacet.ac.in</a></div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-300 dark:border-white/20 text-sm">
                            <p className="text-black dark:text-gray-300"><span className="font-semibold text-green-500 dark:text-green-400">Opens 8 AM Mon</span></p>
                            <p className="text-black dark:text-gray-300 mt-1">Total No of Visitors: <span className="font-semibold text-black dark:text-white">1,428</span></p>
                        </div>
                    </div>

                    <div id="map" className="glass-card p-1 relative overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                        <iframe
                            src={googleMapsEmbedUrl}
                            className="w-full h-64 sm:h-80 rounded-lg border-0 pointer-events-none"
                            allowFullScreen={false}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title={`Map of ${collegeName}`}
                        ></iframe>
                        <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Open BLDEA college location in Google Maps (opens in new tab)"
                            className="absolute inset-0 flex items-center justify-center bg-white/30 dark:bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                        >
                            <span className="px-4 py-2 bg-black/50 backdrop-blur-md rounded-lg text-white font-semibold border border-white/20">
                                View on Google Maps
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdmissionPage;