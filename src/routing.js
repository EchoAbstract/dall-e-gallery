let handlersInstalled = false;

export function route(url) {
  const baseUrl = import.meta.env.BASE_URL;
  const origin = window.location.origin;
  const fixedUrl = `${origin}${baseUrl}${url}`;
  window.history.pushState({}, "", fixedUrl);
}

export function home() {
  const baseUrl = import.meta.env.BASE_URL;
  const origin = window.location.origin;
  const url = `${origin}${baseUrl}`;
  window.history.pushState({}, "", url);
}

// Is this still needed?
export function fixPath(location) {
  const baseUrl = import.meta.env.BASE_URL;

  if (!location.pathname.endsWith(baseUrl) && location.pathname.endsWith("/")) {
    location.replace(
      location.href.substring(0, window.location.href.length - 1),
    );
  }
}

export function getURLHash(location) {
  const parts = location.pathname.split("/");
  const hash = parts[parts.length - 1];
  return hash;
}
