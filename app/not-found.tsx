export default function NotFound() {
  return (
    <div className="min-h-screen bg-cloudwhite">
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="font-space-grotesk font-bold text-3xl md:text-4xl mb-4 text-gray-900">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn’t find what you’re looking for.
        </p>
        <a href="/" className="btn-coral inline-block px-8 py-4">
          Back to Blog
        </a>
      </div>
    </div>
  );
}

