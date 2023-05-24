// Originally inspired by  David Walsh (https://davidwalsh.name/javascript-debounce-function)
// Copied from https://levelup.gitconnected.com/debounce-in-javascript-improve-your-applications-performance-5b01855e086

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// `wait` milliseconds.
// Passing `true` for immediate will call the function on the leading edge AND
// call it on the trailing edge as normal.
export default function debounce(func, wait, immediate) {
  // Function scoped timeout handle
  var timeout;

  // This is the function that is returned and will be executed many times
  // We spread (...args) to capture any number of parameters we want to pass
  return function executedFunction(...args) {
    // The callback function to be executed after the debounce time has elapsed
    const later = () => {
      // null timeout to indicate the debounce ended
      timeout = null;
      
      // Execute the callback
      func(...args);
    };

    // Determine if the function should be called right now.
    // If the immediate flag is set to true and the timeout has not been set
    // yet, then the function should be called.
    const callNow = immediate && !timeout;

    // This will reset the waiting every function execution.
    // This is the step that prevents the function from being executed because
    // it will never reach the inside of the previous setTimeout.
    clearTimeout(timeout);
    
    // Restart the debounce waiting period.
    // setTimeout returns a truthy value (it differs in web vs Node)
    timeout = setTimeout(later, wait);

    // Execute the function now if necessary
    if (callNow) {
      func(...args);
    }
  };
}
