import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Image src="/logo.svg" alt="AI Interview Practice" width={40} height={40} />
          <span className="text-xl font-bold">AI Interview Practice</span>
        </div>
        <div className="flex space-x-4">
          <Link href="/login" className="px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
            Login
          </Link>
          <Link 
            href="/signup" 
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Master Your Interview Skills with AI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Practice interviews with AI-powered mock interviews. Get real-time feedback and improve your interview skills with personalized training modules.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup" 
              className="px-8 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-lg font-medium"
            >
              Get Started
            </Link>
            <Link 
              href="/demo" 
              className="px-8 py-3 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-lg font-medium"
            >
              Try Demo
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">AI-Powered Interviews</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Practice with our advanced AI that simulates real interview scenarios and provides detailed feedback.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Real-Time Feedback</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get instant feedback on your responses, body language, and communication skills.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Personalized Training</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Access customized training modules based on your performance and areas of improvement.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 dark:text-gray-300">
              © 2024 AI Interview Practice. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
