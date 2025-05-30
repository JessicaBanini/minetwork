// SettingsSidebar.jsx
import React from "react";
import ComingSoonModal from "./ComingSoonModal";

const SettingsSidebar = ({ isOpen, onClose }) => {
  const [isComingSoonOpen, setIsComingSoonOpen] = React.useState(false);

  // Define settings menu items with a consistent structure
  const settingsMenu = [
    {
      title: "PROFILE",
      subtitle: "Jessica E. T Banini",
      details: "Name, phone & email",
      profilePicture: "https://via.placeholder.com/150 ", // Add a placeholder profile picture URL
    },
    { title: "CARD APPLICATION", subtitle: "Verify Address", details: "Unverified" },
    {
      title: "ACCOUNT",
      subtitles: [
        { subtitle: "Payment Currency", details: "$ USD" },
        { subtitle: "Language", details: "English" },
        { subtitle: "PayString" },
      ],
    },
    { title: "APP CUSTOMIZATION", subtitle: "App Customization Settings" },
    { title: "THEME", subtitle: "Change Theme" },
  ];

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-90 bg-[#0a192f] text-white z-50 transform transition-transform duration-100 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4">
          <h2 className="text-lg font-bold text-[#ffffff] w-full text-center">Settings</h2>
          <button
            className="text-gray-400 hover:text-white focus:outline-none"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <div className="overflow-y-auto max-h-screen">
          {settingsMenu.map((item, index) => (
            <div key={index}>
              {/* Main Title */}
              <div className="bg-[#11224069] px-4 py-4">
                <h3 className="text-xs text-gray-400">{item.title}</h3>
              </div>

              {/* Profile Section with Image */}
              {item.title === "PROFILE" && (
                <div
                  className="mb-4 cursor-pointer"
                  onClick={() => setIsComingSoonOpen(true)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex items-center px-5 py-4 border-b border-[#2a3a554b]">
                    {/* Profile Picture */}
                    <img
                      src={item.profilePicture} // Use the profile picture URL
                      alt="Profile"
                      className="w-12 h-12 rounded-full mr-4 border-1 border-[#2a3a55fa]"
                    />
                    {/* Profile Details */}
                    <div>
                      <p className="text-xs text-[#ffffff] font-bold">{item.subtitle}</p>
                      <p className="text-xs text-gray-400">{item.details}</p>
                    </div>
                    {/* Arrow Icon */}
                    <span className="text-gray-400 text-sm ml-auto">→</span>
                  </div>
                </div>
              )}

              {/* Subtitles (for ACCOUNT) */}
              {item.subtitles ? (
                item.subtitles.map((sub, subIndex) => (
                  <div
                    key={subIndex}
                    className="mb-4 cursor-pointer"
                    onClick={() => setIsComingSoonOpen(true)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a3a554b]">
                      <p className="text-xs text-[#ffffff]">{sub.subtitle}</p>
                      {sub.details && (
                        <p className="text-xs text-gray-400">{sub.details}</p>
                      )}
                      {/* Arrow Icon */}
                      {/* <span className="text-gray-400 text-sm ml-2">→</span> */}
                    </div>
                  </div>
                ))
              ) : (
                item.title !== "PROFILE" && (
                  <div
                    className="mb-4 cursor-pointer"
                    onClick={() => setIsComingSoonOpen(true)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="flex items-center justify-between px-5 py-4 ">
                      {item.subtitle && (
                        <p className="text-xs text-[#ffffff]">{item.subtitle}</p>
                      )}
                      {item.details && (
                        <p className="text-xs text-gray-400">{item.details}</p>
                      )}
                      {/* Arrow Icon */}
                      {/* <span className="text-gray-400 text-sm ml-2">→</span> */}
                    </div>
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 ${
          isOpen ? "visible" : "hidden"
        }`}
        onClick={onClose}
        role="presentation"
      ></div>

      {/* Coming Soon Modal */}
      <ComingSoonModal
        isOpen={isComingSoonOpen}
        onClose={() => setIsComingSoonOpen(false)}
      />
    </>
  );
};

export default SettingsSidebar;