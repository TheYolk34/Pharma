export const ROUTES = {
    HOME: "/",
    ILLNESSES: "/illnesses",
    MODER_ILLNESSES: "/moderator-illnesses",
  }
  export type RouteKeyType = keyof typeof ROUTES;
  export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
    HOME: "Главная",
    ILLNESSES: "Болезни",
    MODER_ILLNESSES: "Болезни",
  };