import { createSignal, onMount } from "solid-js";
import {
  ConfigColorMode,
  MaybeConfigColorMode,
  useColorMode,
} from "@kobalte/core";
import Laptop from "lucide-solid/icons/laptop";
import Moon from "lucide-solid/icons/moon";
import Sun from "lucide-solid/icons/sun";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

function parseCookie(): MaybeConfigColorMode {
  const match = document.cookie.match(/(^| )kb-color-mode=([^;]+)/);
  return match?.[2] as MaybeConfigColorMode;
}

const ThemeSwitcher = () => {
  const { setColorMode } = useColorMode();
  const [theme, setSelectedTheme] = createSignal<ConfigColorMode>();
  const [open, setOpen] = createSignal(false);

  onMount(() => {
    setSelectedTheme(
      ["light", "dark", "system"].find(
        (option) => option === parseCookie(),
      ) as ConfigColorMode,
    );
  });

  return (
    <DropdownMenu open={open()} onOpenChange={setOpen}>
      <DropdownMenuTrigger as={Button} variant="ghost" size="sm">
        <span class="sr-only">Theme switcher</span>
        {theme() === "light" ? (
          <Sun class="text-muted-foreground size-4" />
        ) : theme() === "dark" ? (
          <Moon class="text-muted-foreground size-4" />
        ) : (
          <Laptop class="text-muted-foreground size-4" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-fit">
        <DropdownMenuRadioGroup
          value={theme()}
          onChange={(e) => {
            setColorMode(e);
            setSelectedTheme(e);
            setOpen(false);
          }}
        >
          <DropdownMenuRadioItem class="flex gap-2" value="light">
            <Sun class="text-muted-foreground size-4" /> <span>Light</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem class="flex gap-2" value="dark">
            <Moon class="text-muted-foreground size-4" /> <span>Dark</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem class="flex gap-2" value="system">
            <Laptop class="text-muted-foreground size-4" /> <span>System</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ThemeSwitcher };
