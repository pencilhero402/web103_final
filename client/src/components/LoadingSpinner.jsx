function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-800 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600 font-medium">
          Loading movies...
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Please wait while we fetch the latest content
        </p>
      </div>
    </div>
  );
}

export default LoadingSpinner;
