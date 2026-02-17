import { Suspense } from "solid-js";
import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { getRequestEvent, isServer } from "solid-js/web";
import {
  ColorModeProvider,
  ColorModeScript,
  cookieStorageManagerSSR,
} from "@kobalte/core";
import { getCookie } from "vinxi/http";
import { ThemeSwitcher } from "./components/theme-switcher";

import "./app.css";

function getServerCookies() {
  "use server";
  const colorMode = getCookie("kb-color-mode");
  return colorMode ? `kb-color-mode=${colorMode}` : "";
}

export default function App() {
  const storageManager = cookieStorageManagerSSR(
    isServer ? getServerCookies() : document.cookie,
  );

  const event = getRequestEvent();

  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <ColorModeScript
            storageType={storageManager.type}
            nonce={event?.locals.nonce}
          />
          <ColorModeProvider
            initialColorMode="system"
            storageManager={storageManager}
          >
            <Suspense>{props.children}</Suspense>
            <footer class="mx-auto flex w-full items-center justify-center border-t py-16 text-center text-xs">
              <ThemeSwitcher />
            </footer>
          </ColorModeProvider>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
