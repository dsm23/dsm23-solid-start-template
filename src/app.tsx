import { Suspense } from "solid-js";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";

import "./app.css";

import { isServer } from "solid-js/web";
import {
  ColorModeProvider,
  ColorModeScript,
  cookieStorageManagerSSR,
} from "@kobalte/core";
import { getCookie } from "vinxi/http";
import { ThemeSwitcher } from "./components/theme-switcher";

function getServerCookies() {
  "use server";
  const colorMode = getCookie("kb-color-mode");
  return colorMode ? `kb-color-mode=${colorMode}` : "";
}

export default function App() {
  const storageManager = cookieStorageManagerSSR(
    isServer ? getServerCookies() : document.cookie,
  );

  return (
    <Router
      root={(props) => (
        <>
          <ColorModeScript storageType={storageManager.type} />
          <ColorModeProvider
            initialColorMode="system"
            storageManager={storageManager}
          >
            <Suspense>{props.children}</Suspense>
            <footer class="mx-auto flex w-full items-center justify-center border-t py-16 text-center text-xs">
              <ThemeSwitcher />
            </footer>
          </ColorModeProvider>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
