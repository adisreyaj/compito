import cuid from 'cuid';

export const defaultLists = () => {
  return ['Backlog', 'To Do', 'In Progress', 'Done'].map((name) => ({ name, id: cuid() }));
};
