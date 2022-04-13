function calculateCommitTime(commitTimestamp) {
  const currentTimestamp = Math.round(new Date().getTime() / 1000);
  const diffSec = Math.round(currentTimestamp - commitTimestamp);
  if (diffSec < 60) {
    return `${diffSec} seconds ago`;
  }
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) {
    return `${diffMin} minutes ago`;
  }
  const diffHours = Math.round(diffMin / 60);
  if (diffHours < 24) {
    return `${diffHours} hours ago`;
  }
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 365) {
    return `${diffDays} days ago`;
  }
  return `${Math.round(diffDays / 365)} yeats ago`;
}

export default calculateCommitTime;
