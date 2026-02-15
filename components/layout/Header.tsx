
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import * as Icons from '../common/Icons';
import NotificationCenter from '../common/NotificationCenter';

const Bars3Icon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const HeaderNavLink: React.FC<{ to: string, children: React.ReactNode }> = ({ to, children }) => (
    <NavLink to={to} className="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 font-medium transition-transform transform hover:scale-105">
        {children}
    </NavLink>
);


interface HeaderProps {
    setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
    const { user } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const isFaculty = user?.role === 'faculty';

    if (isFaculty) {
        return (
             <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 border-b dark:border-gray-700 z-30 relative">
                <div className="flex items-center">
                    <button onClick={() => setSidebarOpen(true)} className="text-gray-500 focus:outline-none lg:hidden">
                        <Bars3Icon className="h-6 w-6" />
                    </button>
                    <div className="relative mx-4 lg:mx-0">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Icons.SearchIcon className="w-5 h-5 text-gray-500" />
                        </span>
                        <input className="w-full py-2 pl-10 pr-4 text-gray-700 bg-gray-100 border border-transparent rounded-lg dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white dark:focus:bg-gray-700 focus:border-blue-500" type="text" placeholder="Search" />
                    </div>
                </div>
                 <div className="flex items-center space-x-4">
                    <button onClick={toggleTheme} className="p-2 text-gray-500 bg-gray-100 rounded-full hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-transform hover:scale-110" aria-label="Toggle theme">
                         {theme === 'light' ? <Icons.MoonIcon className="w-6 h-6" /> : <Icons.SunIcon className="w-6 h-6" />}
                    </button>
                    
                    {/* Notification Center */}
                    <NotificationCenter />

                     <button className="p-2 text-gray-500 bg-gray-100 rounded-full hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-transform hover:scale-110">
                        <Icons.MessageIcon className="w-6 h-6"/>
                    </button>
                     <button className="p-1 bg-gray-100 rounded-full hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-transform hover:scale-110">
                        <img className="w-8 h-8 rounded-full object-cover" src={user.profilePicUrl} alt={user.name} />
                    </button>
                 </div>
            </header>
        );
    }
    
    // Student Header
    return (
        <header className="flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm z-30 relative">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-bldeacet-blue rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">A</span>
                </div>
                <span className="font-bold text-lg text-bldeacet-blue dark:text-white hidden sm:block">BLDEACET</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
                <HeaderNavLink to="/dashboard">Home</HeaderNavLink>
                <HeaderNavLink to="/settings">Settings</HeaderNavLink>
                <HeaderNavLink to="/manage">My account</HeaderNavLink>
            </nav>

            <div className="flex items-center gap-4">
                 <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 transition-transform hover:scale-110" aria-label="Toggle theme">
                    {theme === 'light' ? <Icons.MoonIcon className="w-6 h-6" /> : <Icons.SunIcon className="w-6 h-6" />}
                </button>
                
                {/* Notification Center */}
                <NotificationCenter />

                <button onClick={() => setSidebarOpen(true)} className="text-gray-500 focus:outline-none lg:hidden">
                    <Bars3Icon className="h-6 w-6" />
                </button>
            </div>
        </header>
    );
};

export default Header;
