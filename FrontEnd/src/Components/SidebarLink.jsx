import React from 'react';

const SidebarLink = ({ label, icon, isActive, onClick }) => {
    return (
        <a
            className={`sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
            href="#"
            onClick={(e) => {
                e.preventDefault();
                onClick();
            }}
        >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
            </svg>
            {label}
        </a>
    );
};

export default SidebarLink;