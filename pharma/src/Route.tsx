export const ROUTES = {
    HOME: "/",
    ILLNESSES: "/illnesses",
  }
  export type RouteKeyType = keyof typeof ROUTES;
  export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
    HOME: "Главная",
    ILLNESSES: "Болезни",
  };