import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const SnippetView = ({ siteId, siteUrl, snippet: providedSnippet }) => {
  const [copied, setCopied] = useState(false);

  // Use provided snippet from API response, or fallback to constructed one
  const snippet = providedSnippet || `<script>
(function() {
  var script = document.createElement('script');
  script.src = 'https://localhost:8000/analytics-client.js';
  script.setAttribute('data-site-id', '${siteId}');
  script.async = true;
  document.head.appendChild(script);
})();
</script>`;
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Installation Code</h3>
        <p className="text-sm text-gray-600 mb-4">
          Copy and paste this code into the head section of your website:
        </p>
      </div>

      <div className="relative">
        <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto border">
          <code>{snippet}</code>
        </pre>
        
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-2 bg-white rounded-md shadow-sm border hover:bg-gray-50 transition-colors"
          title={copied ? 'Copied!' : 'Copy to clipboard'}
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Installation Instructions:</h4>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Copy the code above</li>
          <li>Paste it into the head section of every page you want to track</li>
          <li>Save and publish your changes</li>
          <li>Analytics data will start appearing within a few minutes</li>
        </ol>
      </div>

      {siteUrl && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Site Information:</h4>
          <p className="text-sm text-gray-600">
            <strong>Site URL:</strong> {siteUrl}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Site ID:</strong> {siteId}
          </p>
        </div>
      )}
    </div>
  );
};

export default SnippetView;
