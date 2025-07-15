export const upcomingComparator = (a: any, b: any) => {
  const d1 = new Date(a.at).getTime();
  const d2 = new Date(b.at).getTime();
  if (d1 !== d2) return d1 - d2;
  return a.location.localeCompare(b.location);
};
