
import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { PLACEMENT_DATA } from '../data/placementData';
import { PlacementRecord } from '../types';
import * as Icons from '../components/common/Icons';

const PlacementKPI: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="group relative bg-[#112B5C]/30 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-center gap-5 transition-all duration-500 hover:bg-[#112B5C]/50 hover:-translate-y-1 hover:shadow-[0_6px_18px_rgba(0,0,0,0.25)] overflow-hidden shadow-[0_6px_18px_rgba(0,0,0,0.15)]">
        {/* Subtle shine effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"></div>
        
        <div className="bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] p-4 rounded-full shadow-lg border border-white/10 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
            {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { className: "w-6 h-6 text-white drop-shadow-md" }) : icon}
        </div>
        <div className="relative z-10">
            <p className="text-3xl font-extrabold text-white tracking-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] group-hover:text-blue-50 transition-colors">{value}</p>
            <p className="text-xs font-semibold text-[#D0D7E7] uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity mt-1">{title}</p>
        </div>
    </div>
);

const CompanyDrawer: React.FC<{ company: PlacementRecord | null; onClose: () => void, allPlacements: PlacementRecord[] }> = ({ company, onClose, allPlacements }) => {
    const companyData = useMemo(() => {
        if (!company) return null;
        const placements = allPlacements.filter(p => p.company_name === company.company_name);
        const years = [...new Set(placements.map(p => p.year))].sort((a: number, b: number) => b - a);
        const branches = [...new Set(placements.map(p => p.branch))];
        const roles = [...new Set(placements.map(p => p.role).filter(Boolean))];
        const highestPackage = Math.max(...placements.map(p => p.highest_package || 0));
        return { placements, years, branches, roles, highestPackage };
    }, [company, allPlacements]);

    if (!company || !companyData) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose}></div>
            <div className={`fixed top-0 right-0 h-full w-full max-w-lg bg-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${company ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">{company.company_name}</h2>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-gray-300">&times;</button>
                    </div>
                    <div className="overflow-y-auto flex-grow pr-2">
                        <div className="space-y-4 text-gray-300">
                            <p><strong>Recruited in Years:</strong> {companyData.years.join(', ')}</p>
                            <p><strong>Branches Recruited:</strong> {companyData.branches.join(', ')}</p>
                            <p><strong>Roles Offered:</strong> {companyData.roles.join(', ') || 'Varies'}</p>
                            <p><strong>Highest Package Offered:</strong> <span className="font-bold text-green-400">{companyData.highestPackage.toFixed(2)} LPA</span></p>
                             {company.company_website && <a href={company.company_website} target="_blank" rel="noopener noreferrer" className="inline-block text-primary-400 hover:underline">Visit Company Website &rarr;</a>}
                            <h3 className="font-semibold text-white pt-4 border-t border-white/20">Placement History</h3>
                            <ul className="space-y-2">
                                {companyData.placements.map(p => (
                                    <li key={p.id} className="text-sm p-2 bg-white/5 rounded-md">
                                        <span className="font-bold">{p.year}</span> - {p.branch} Branch: {p.placed_count} student(s) placed.
                                        {p.highest_package && ` (Package: ${p.highest_package} LPA)`}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};


const PlacementPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedYears, setSelectedYears] = useState<number[]>([]);
    const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
    const [sortConfig, setSortConfig] = useState<{ key: keyof PlacementRecord; direction: 'ascending' | 'descending' } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedCompany, setSelectedCompany] = useState<PlacementRecord | null>(null);

    const uniqueYears = useMemo(() => [...new Set(PLACEMENT_DATA.map(p => p.year))].sort((a, b) => b - a), []);
    const uniqueBranches = useMemo(() => [...new Set(PLACEMENT_DATA.map(p => p.branch))].sort(), []);

    const filteredData = useMemo(() => {
        let data = PLACEMENT_DATA;

        if (searchTerm) {
            data = data.filter(item =>
                Object.values(item).some(val =>
                    String(val).toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
        if (selectedYears.length > 0) {
            data = data.filter(item => selectedYears.includes(item.year));
        }
        if (selectedBranches.length > 0) {
            data = data.filter(item => selectedBranches.includes(item.branch));
        }

        if (sortConfig !== null) {
            data.sort((a, b) => {
                if (a[sortConfig.key]! < b[sortConfig.key]!) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key]! > b[sortConfig.key]!) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return data;
    }, [searchTerm, selectedYears, selectedBranches, sortConfig]);
    
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        return filteredData.slice(startIndex, startIndex + rowsPerPage);
    }, [filteredData, currentPage, rowsPerPage]);

    const kpis = useMemo(() => {
        const totalCompanies = new Set(filteredData.map(d => d.company_name)).size;
        const totalPlaced = filteredData.reduce((sum, d) => sum + d.placed_count, 0);
        const highestPackage = Math.max(...filteredData.map(d => d.highest_package || 0));
        return { totalCompanies, totalPlaced, highestPackage };
    }, [filteredData]);
    
    const requestSort = (key: keyof PlacementRecord) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: keyof PlacementRecord) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <Icons.SortIcon className="w-4 h-4 opacity-30 group-hover:opacity-100" />;
        }
        return sortConfig.direction === 'ascending' ? <Icons.SortAscIcon className="w-4 h-4" /> : <Icons.SortDescIcon className="w-4 h-4" />;
    };

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <style>{`
                .sticky-header th { position: sticky; top: 0; z-index: 10; }
                @keyframes deep-ocean {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-deep-ocean {
                    background-size: 200% 200%;
                    animation: deep-ocean 15s ease infinite;
                }
            `}</style>
            
            <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-white/10 bg-gradient-to-br from-[#0A1A3A] via-[#0F254E] to-[#112B5C] animate-deep-ocean p-8 mb-8">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none"></div>

                <h1 className="text-3xl font-extrabold text-white mb-6 relative z-10 tracking-tight drop-shadow-md">Placements Overview</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                    <PlacementKPI 
                        title="Total Companies" 
                        value={String(kpis.totalCompanies)} 
                        icon={<Icons.PlacementsIcon />} 
                    />
                    <PlacementKPI 
                        title="Students Placed" 
                        value={String(kpis.totalPlaced)} 
                        icon={<Icons.StudentIcon />} 
                    />
                    <PlacementKPI 
                        title="Highest Package" 
                        value={`${kpis.highestPackage.toFixed(2)} LPA`} 
                        icon={<Icons.SparklesIcon />} 
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                <div className="flex flex-wrap gap-4 mb-4">
                    <input type="text" placeholder="Search anything..." onChange={e => setSearchTerm(e.target.value)} className="flex-grow p-2 bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white" />
                    <select multiple value={selectedYears.map(String)} onChange={e => setSelectedYears(Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => parseInt(option.value)))} className="p-2 bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg text-gray-900 dark:text-white">
                        <option value="" disabled>Filter by Year</option>
                        {uniqueYears.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <select multiple value={selectedBranches} onChange={e => setSelectedBranches(Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value))} className="p-2 bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg text-gray-900 dark:text-white">
                        <option value="" disabled>Filter by Branch</option>
                        {uniqueBranches.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                </div>
                
                <div className="overflow-x-auto relative">
                    <table className="w-full text-left">
                        <thead className="sticky-header bg-gray-50 dark:bg-gray-700 text-xs uppercase text-black dark:text-gray-400">
                            <tr>
                                {(['year', 'company_name', 'branch', 'placed_count', 'highest_package'] as const).map(key => (
                                    <th key={key} className="p-3"><button onClick={() => requestSort(key)} className="group flex items-center gap-1">{key.replace('_', ' ')} {getSortIcon(key)}</button></th>
                                ))}
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map(item => (
                                <tr key={item.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-black dark:text-gray-300">
                                    <td className="p-3">{item.year}</td>
                                    <td className="p-3 font-medium text-black dark:text-white">{item.company_name}</td>
                                    <td className="p-3">{item.branch}</td>
                                    <td className="p-3">{item.placed_count}</td>
                                    <td className="p-3 font-semibold">{item.highest_package ? `${item.highest_package.toFixed(2)} LPA` : 'N/A'}</td>
                                    <td className="p-3"><button onClick={() => setSelectedCompany(item)} className="font-medium text-primary-600 hover:underline">View</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <p className="text-sm text-black dark:text-gray-400">Showing {paginatedData.length} of {filteredData.length} records</p>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 text-black dark:text-white">Prev</button>
                        <span className="text-black dark:text-gray-300">Page {currentPage} of {totalPages}</span>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 text-black dark:text-white">Next</button>
                    </div>
                </div>
            </div>
            
            <CompanyDrawer company={selectedCompany} onClose={() => setSelectedCompany(null)} allPlacements={PLACEMENT_DATA} />
        </div>
    );
};

export default PlacementPage;
