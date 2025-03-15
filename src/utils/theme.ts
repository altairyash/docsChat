export function toggleTheme(currentTheme: string, setTheme: Function) {
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  }
  