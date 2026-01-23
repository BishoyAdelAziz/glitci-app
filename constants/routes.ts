export interface Route {
  id: number;
  name: string;
  path: string;
}

export const Routes: Route[] = [
  { id: 1, name: "overview", path: "/overview" },
  { id: 2, name: "projects", path: "/projects" },
  { id: 3, name: "clients", path: "/clients" },
  { id: 4, name: "employees", path: "/employees" },
  { id: 5, name: "services", path: "/services" },
  { id: 6, name: "finance", path: "/finance" },
];
