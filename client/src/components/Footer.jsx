function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <h2 className="text-xl font-bold text-gray-800 mr-8">Scene it</h2>
            <p className="text-sm text-gray-600">
              Discover and track your favorite movies
            </p>
          </div>

          <div className="flex items-center space-x-6">
            <a
              href="#"
              className="text-gray-600 hover:text-gray-800 text-sm transition-colors"
            >
              About
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-gray-800 text-sm transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-gray-800 text-sm transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-gray-800 text-sm transition-colors"
            >
              Contact
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            © 2025 Scene it. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
