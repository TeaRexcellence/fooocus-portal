'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [accessCode, setAccessCode] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  useEffect(() => {
    if (lockTimer > 0) {
      const timer = setTimeout(() => {
        setLockTimer(lockTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (lockTimer === 0 && isLocked) {
      setIsLocked(false);
      setAttempts(0);
    }
  }, [lockTimer, isLocked]);

  const checkAccess = () => {
    if (isLocked) return;

    const CORRECT_CODE = process.env.NEXT_PUBLIC_ACCESS_CODE;
    const FOOOCUS_URL = process.env.NEXT_PUBLIC_FOOOCUS_URL;

    if (!CORRECT_CODE || !FOOOCUS_URL) {
      setMessage('Configuration error');
      setIsError(true);
      return;
    }

    if (accessCode === CORRECT_CODE) {
      setMessage('Connecting...');
      setIsError(false);
      window.location.href = FOOOCUS_URL;
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= 5) {
        setIsLocked(true);
        setLockTimer(30);
        setMessage('Too many attempts. Try again in 30 seconds.');
      } else {
        setMessage(`Incorrect code. ${5 - newAttempts} attempts remaining.`);
      }
      setIsError(true);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Fooocus Portal</h1>
          <p className="mt-2 text-gray-600">Enter your access code to continue</p>
        </div>

        <div className="space-y-4">
          <div>
            <input
              type="password"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isLocked && checkAccess()}
              placeholder="Enter access code"
              disabled={isLocked}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100"
              autoComplete="off"
            />
          </div>

          <button
            onClick={checkAccess}
            disabled={isLocked}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors font-medium disabled:bg-gray-400"
          >
            {isLocked ? `Locked (${lockTimer}s)` : 'Access Fooocus'}
          </button>

          {message && (
            <p 
              className={`text-center ${
                isError ? 'text-red-600' : 'text-green-600'
              } font-medium`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}