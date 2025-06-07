import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { routes, routeArray } from '@/config/routes';
import HomePage from '@/components/pages/HomePage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ApperIcon from './components/ApperIcon';

function App() {
  const [activeTab, setActiveTab] = useState('all-issues');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const currentRoute = routes[activeTab];

  return (
    <div className={`min-h-screen bg-surface-50 dark:bg-surface-900 transition-colors duration-300`}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          routes={routeArray}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            setSidebarOpen={setSidebarOpen}
          />

          {/* Page Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-surface-50 dark:bg-surface-900">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
{/* The routes object will reference HomePage via config/routes.js */}
                  {/* Assuming routes['all-issues'].component is HomePage for this example */}
                  {activeTab === 'all-issues' ? <HomePage /> : <currentRoute.component />}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? 'dark' : 'light'}
        className="!mt-16"
      />
    </div>
  );
}

export default App;