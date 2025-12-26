
import React from 'react';
import { Page } from '../types';

interface NavigationProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, setCurrentPage }) => {
  const navItems = Object.values(Page);

  return (
    <nav className="bg-slate-800/60 p-1.5 rounded-full">
      <ul className="flex items-center space-x-2">
        {navItems.map((page) => (
          <li key={page}>
            <button
              onClick={() => setCurrentPage(page)}
              className={`inline-block py-2 px-5 text-sm font-semibold text-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50
                ${
                  currentPage === page
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'text-slate-300 bg-transparent hover:bg-slate-700/50'
                }
              `}
            >
              {page}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
