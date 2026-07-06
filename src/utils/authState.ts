/**
 * authState — module-level auth flag for pure utility functions.
 *
 * React hooks can't be called from plain utility modules (favorites.ts, storage.ts, etc.).
 * This module provides a simple boolean flag that useCloudSync sets on sign-in
 * and clears on sign-out. Utility functions check this before writing user data.
 */

let _isAuthenticated = false;

export const setAuthenticated = (v: boolean) => { _isAuthenticated = v; };
export const isAuthenticated = () => _isAuthenticated;
