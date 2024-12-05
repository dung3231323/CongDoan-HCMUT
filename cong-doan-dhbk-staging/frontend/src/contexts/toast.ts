//! Deprecated

// Wrap application with ToastContext.Provider
// Add Toast component inside ToastContext.Provider
// Bind Toast component to useRef
// Show toast by calling show(), pass function to ToastContext.Provider value
import { createContext } from 'react';
import type { ToastMessage } from 'primereact/toast';

const ToastContext = createContext({
  showToast: (_: ToastMessage) => {}, // eslint-disable-line @typescript-eslint/no-unused-vars
});

export default ToastContext;
