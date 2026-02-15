
import React, { useState, useEffect, useMemo } from 'react';
import * as Icons from '../components/common/Icons';

const feeStructure = [
    { sl: 1, branch: 'Bachelor of Architecture', fees: '1,40,000/-' },
    { sl: 2, branch: 'Civil Engineering', fees: '1,40,000/-' },
    { sl: 3, branch: 'Computer Science & Engineering', fees: '3,60,000/-' },
    { sl: 4, branch: 'Computer Science & Engineering (AIML)', fees: '2,75,000/-' },
    { sl: 5, branch: 'Computer Science & Engineering (Data Science)', fees: '2,50,000/-' },
    { sl: 6, branch: 'Electronics & Communication Engineering', fees: '2,50,000/-' },
    { sl: 7, branch: 'Electrical & Electronics Engineering', fees: '1,65,000/-' },
    { sl: 8, branch: 'Information Science & Engineering', fees: '2,75,000/-' },
    { sl: 9, branch: 'Mechanical Engineering', fees: '1,40,000/-' },
];

type FeeStructureItem = typeof feeStructure[0];

const FeesPage: React.FC = () => {
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof FeeStructureItem | null; direction: 'ascending' | 'descending' }>({ key: 'sl', direction: 'ascending' });
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handlePaymentClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (isRedirecting) return;

        const button = event.currentTarget;
        const circle = document.createElement("span");
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        
        const buttonRect = button.getBoundingClientRect();
        
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - buttonRect.left - radius}px`;
        circle.style.top = `${event.clientY - buttonRect.top - radius}px`;
        circle.classList.add("ripple");
        
        const existingRipple = button.getElementsByClassName("ripple")[0];
        if (existingRipple) {
            existingRipple.remove();
        }
        button.appendChild(circle);

        setIsRedirecting(true);
        setTimeout(() => {
            window.open('https://erp.bldeerp.com/payments?query=xFOfEk7vOn2ZEl7G0SOOrg==', '_blank');
            setIsRedirecting(false);
        }, 1200);
    };

    const sortedAndFilteredFees = useMemo(() => {
        let sortableItems = [...feeStructure].filter(item => 
            item.branch.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                const valA = a[sortConfig.key!];
                const valB = b[sortConfig.key!];
                
                if (valA < valB) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (valA > valB) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [searchTerm, sortConfig]);

    const requestSort = (key: keyof FeeStructureItem) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };
    
    const getSortIcon = (key: keyof FeeStructureItem) => {
        if (sortConfig.key !== key) {
            return <Icons.SortIcon className="w-4 h-4 text-gray-400 opacity-50 transition-opacity group-hover:opacity-100" />;
        }
        return sortConfig.direction === 'ascending' 
            ? <Icons.SortAscIcon className="w-4 h-4 text-primary-500" /> 
            : <Icons.SortDescIcon className="w-4 h-4 text-primary-500" />;
    };

    return (
        <div className={`p-4 sm:p-6 md:p-8 space-y-8 transition-opacity duration-1000 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
            <style>{`
                .payment-button {
                    position: relative;
                    overflow: hidden;
                    transition: all 0.25s ease-in-out;
                    --tw-shadow-color: #f97316; /* primary-500 */
                    --tw-shadow: 0 0 #0000;
                }
                .payment-button:hover {
                    transform: translateY(-4px) scale(1.03);
                    box-shadow: 0 0 20px 0px hsla(26, 95%, 53%, 0.4), 0 10px 20px -5px rgba(0,0,0,0.3);
                }
                .payment-button::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 50%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                    transition: left 0.6s ease;
                }
                .payment-button:hover::before {
                    left: 125%;
                }
                .ripple {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.5);
                    transform: scale(0);
                    animation: ripple-effect 0.6s linear;
                    pointer-events: none;
                }
                @keyframes ripple-effect {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
                .fade-in-up {
                    animation: fadeInUp 0.8s ease-out forwards;
                    opacity: 0;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .table-container { animation-delay: 200ms; }
                .notes-container { animation-delay: 400ms; }
                .sticky-header th {
                    position: sticky;
                    top: 0;
                    z-index: 10;
                    backdrop-filter: blur(8px);
                    background-color: rgba(249, 250, 251, 0.85); /* gray-50 */
                }
                .dark .sticky-header th {
                    background-color: rgba(55, 65, 81, 0.85); /* gray-700 */
                }
            `}</style>
            
            <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg">
                {/* 1. Payment Button */}
                <div className="mb-8">
                    <button 
                        onClick={handlePaymentClick}
                        disabled={isRedirecting}
                        className="payment-button w-full px-6 py-4 bg-primary-600 text-white text-lg font-bold rounded-lg focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-primary-500 shadow-lg"
                    >
                        <span className="relative z-10 flex items-center justify-center">
                            {isRedirecting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : "Click here to pay your fees"}
                        </span>
                    </button>
                </div>

                {/* 2. Fees Structure Table */}
                <div className="fade-in-up table-container">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Fees Structure</h2>
                        <div className="relative w-full sm:w-auto">
                           <Icons.SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search branch..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full sm:w-48 pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all sm:focus:w-64"
                            />
                        </div>
                    </div>
                    <div className="overflow-auto max-h-[400px] rounded-lg border dark:border-gray-700 relative">
                        <table className="w-full text-left min-w-[600px]">
                            <thead className="sticky-header">
                                <tr className="border-b dark:border-gray-700 shadow-sm">
                                    <th className="p-4"><button onClick={() => requestSort('sl')} className="group flex items-center gap-2 font-semibold text-gray-600 dark:text-gray-300">SL. NO. {getSortIcon('sl')}</button></th>
                                    <th className="p-4"><button onClick={() => requestSort('branch')} className="group flex items-center gap-2 font-semibold text-gray-600 dark:text-gray-300">BRANCH {getSortIcon('branch')}</button></th>
                                    <th className="p-4"><button onClick={() => requestSort('fees')} className="group flex items-center gap-2 font-semibold text-gray-600 dark:text-gray-300">FEES <span className="font-normal">(Mgmt. Quota 2025–26)</span> {getSortIcon('fees')}</button></th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedAndFilteredFees.map(item => (
                                    <tr key={item.sl} className="border-b dark:border-gray-700 last:border-0 hover:bg-primary-50 dark:hover:bg-white/5 transition-all duration-200 transform hover:shadow-inner hover:translate-y-[-1px]">
                                        <td className="p-4 w-24 text-gray-600 dark:text-gray-400">{item.sl}.</td>
                                        <td className="p-4 font-medium text-gray-800 dark:text-gray-100">{item.branch}</td>
                                        <td className="p-4 font-semibold text-gray-700 dark:text-gray-200">{item.fees}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 3. Notes & Details */}
                <div className="fade-in-up notes-container mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Notes & Details</h3>
                    <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400 list-decimal list-inside">
                        <li>In addition to the above mentioned fee structure Examination fees and skill lab fees has to be paid as applicable every year.</li>
                        <li>Placement training fees will be charged separately for additional training and other services to groom and strengthen the students to take up the placements tests and interviews and get placed in good companies.</li>
                        <li>All the payments to be made mandatorily by DD in favor of Principal, BLDEA’s V.P. Dr. PGHCET payable at Vijayapur after confirmation by the Institute Admission co-ordinator.</li>
                        <li><strong className="font-bold text-red-600 dark:text-red-400">CASH transactions and CHEQUES are not allowed.</strong></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default FeesPage;
