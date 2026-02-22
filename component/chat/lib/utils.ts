function formatStatus(lastSeen?: number) {
  if (!lastSeen) return "Offline";
  
  const now = Date.now();
  const diffInSeconds = Math.floor((now - lastSeen) / 1000);
  
  
  if (diffInSeconds < 60) return "Online";
  
  if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}m ago`;
  }
  
  // If active in the last 24 hours, show hours
  if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  }
  
  return "Offline";
}