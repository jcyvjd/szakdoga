import { useState } from 'react';

import GameRules from './GameRules';
import HowToUse from './HowToUse';

const HelpPanel = ({ isOpen, setShowHelpPanel }) => {
    const [selectedTab, setSelectedTab] = useState('rules');

    const closeHelpPanel = () => {
        setShowHelpPanel(false);
    };

    return (
        <div 
            className={`fixed inset-0 bg-opacity-50 bg-black z-50 flex justify-center items-center transition-all duration-500 ease-in-out ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        >
            <div 
                className="bg-base-200 p-4 rounded-lg transition-all transform duration-500 ease-in-out text-retro-content" 
                style={{ 
                    width: '80vw', 
                    height: '80vh', 
                    transform: isOpen ? 'translate(-50%, -50%)' : 'translate(-50%, 100%)', 
                    top: '50%', 
                    left: '50%', 
                    position: 'absolute' 
                }}
            >
                <div className="flex justify-between items-center">
                    {/* Tab buttons */}
                    <div className="flex space-x-4 flex-grow">
                        <button 
                            className={`btn flex-grow mx-2 ${selectedTab === 'rules' ? 'btn-primary text-lg px-6' : 'btn-secondary'}`}
                            onClick={() => setSelectedTab('rules')}
                        >
                            Game Rules
                        </button>
                        <button 
                            className={`btn flex-grow mx-2 ${selectedTab === 'usage' ? 'btn-primary text-lg px-6' : 'btn-secondary'}`}
                            onClick={() => setSelectedTab('usage')}
                        >
                            How to Use
                        </button>
                    </div>
                    {/* Close button */}
                    <button
                        className="btn btn-error text-xl cursor-pointer mx-2"
                        onClick={closeHelpPanel}
                    >
                        &times;
                    </button>
                </div>
                {/* Tab content */}
                <div className="mt-4 relative overflow-hidden" style={{ height: 'calc(100% - 50px)' }}>
                    <div 
                        className="absolute top-0 overflow-auto no-scrollbar transition-all transform duration-500 ease-in-out w-full h-full" 
                        style={{ 
                            transform: selectedTab === 'rules' ? 'translateX(0)' : 'translateX(-100%)'
                        }}
                    >
                        <GameRules />
                    </div>
                    <div 
                        className="absolute top-0 transition-all transform duration-500 ease-in-out w-full h-full" 
                        style={{ 
                            transform: selectedTab === 'usage' ? 'translateX(0)' : 'translateX(100%)'
                        }}
                    >
                        <HowToUse />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpPanel;