
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { motion } from "framer-motion";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: theme === "dark" ? 1 : 0 }}
        className="absolute"
        transition={{ duration: 0.3 }}
      >
        <Moon className="h-5 w-5" />
      </motion.div>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: theme === "light" ? 1 : 0 }}
        className="absolute"
        transition={{ duration: 0.3 }}
      >
        <Sun className="h-5 w-5" />
      </motion.div>
    </Button>
  );
};
