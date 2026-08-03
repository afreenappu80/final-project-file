import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiTrendingUp, FiUsers, FiShield } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8"
            >
              <span className="block text-gray-900 dark:text-white">Next Generation</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Student Management
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto"
            >
              Streamline attendance tracking, monitor academic performance, and empower students with our comprehensive educational platform.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-10 flex justify-center gap-4"
            >
              <Link to="/register" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold text-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-1">
                Get Started
              </Link>
              <a href="#features" className="px-8 py-4 glass text-gray-900 dark:text-white rounded-full font-bold text-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                Learn More
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Why Choose EduTrack?</h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Everything you need to manage an educational institution effectively.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: FiUsers, title: 'Student Management', desc: 'Maintain comprehensive student records and profiles easily.' },
              { icon: FiCheckCircle, title: 'Attendance Tracking', desc: 'Real-time attendance logging with automated reporting.' },
              { icon: FiTrendingUp, title: 'Performance Monitoring', desc: 'Visualize grades and academic progress over time.' },
              { icon: FiShield, title: 'Secure Authentication', desc: 'Role-based access control with enterprise-grade security.' }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="glass p-6 rounded-2xl flex flex-col items-center text-center"
              >
                <div className="p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full mb-4">
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2 dark:text-white">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-extrabold mb-2">50k+</div>
              <div className="text-blue-200">Total Students</div>
            </div>
            <div>
              <div className="text-5xl font-extrabold mb-2">99%</div>
              <div className="text-blue-200">Attendance Accuracy</div>
            </div>
            <div>
              <div className="text-5xl font-extrabold mb-2">12</div>
              <div className="text-blue-200">Departments</div>
            </div>
            <div>
              <div className="text-5xl font-extrabold mb-2">150+</div>
              <div className="text-blue-200">Subjects</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Simple Footer for Phase 1 */}
      <footer className="bg-gray-900 text-gray-400 py-12 text-center">
        <p>&copy; 2026 EduTrack. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
