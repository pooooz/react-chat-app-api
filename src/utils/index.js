export const convertLifetimeStringToMilliseconds = (lifetime) => {
  if (/s$/.test(lifetime)) {
    return Number(lifetime.slice(0, -1)) * 1000;
  }

  if (/m$/.test(lifetime)) {
    return Number(lifetime.slice(0, -1)) * 60 * 1000;
  }

  if (/d$/.test(lifetime)) {
    return Number(lifetime.slice(0, -1)) * 24 * 3600 * 1000;
  }

  return 0;
};
