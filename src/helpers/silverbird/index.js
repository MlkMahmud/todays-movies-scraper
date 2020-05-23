export const formatRuntime = (runtime) => {
  const time = runtime.replace(/\D/g, '');
  if (!time || Number.isNaN(+time)) {
    return '--';
  }
  const hours = time.slice(1, 2);
  const mins = time.slice(2);
  return `${hours}h ${mins}m`;
};


export const filterForeignCinemas = (showtimes = []) => (
  [...showtimes].filter(({ cinema }) => !cinema.endsWith('GHANA'))
);
