export function toggleTheme(currentTheme: string, setTheme: (theme: string) => void): void {
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  }
  