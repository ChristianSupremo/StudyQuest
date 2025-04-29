// Smooth scroll to features section on "Try Demo"
document.addEventListener('DOMContentLoaded', function () {
    const tryDemoBtn = document.querySelector('button:nth-of-type(2)');
    const featuresSection = document.getElementById('features');
  
    tryDemoBtn.addEventListener('click', function () {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
  
      // Show a simple popup modal after scrolling
      setTimeout(showDemoPopup, 800); // delay to simulate loading
    });
  });
  
  // Create popup modal (basic example)
  function showDemoPopup() {
    const modal = document.createElement('div');
    modal.className =
      'fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50';
  
    modal.innerHTML = `
      <div class="bg-white p-8 rounded-xl shadow-xl max-w-sm text-center relative">
        <h3 class="text-xl font-bold text-blue-600 mb-2">🎉 Welcome to the Demo!</h3>
        <p class="text-sm text-gray-700 mb-4">This is a sneak peek of what StudyQuest could feel like.</p>
        <button id="closeModal" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Close
        </button>
      </div>
    `;
  
    document.body.appendChild(modal);
  
    // Close modal logic
    document.getElementById('closeModal').addEventListener('click', function () {
      document.body.removeChild(modal);
    });
  }
  