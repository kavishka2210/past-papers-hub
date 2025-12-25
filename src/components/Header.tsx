import { Bell, Search, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import NotificationsDropdown from "./NotificationsDropdown";

interface HeaderProps {
  onSearchClick?: () => void;
}

const Header = ({ onSearchClick }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">
            <span className="text-primary">Tech</span>
            <span className="text-foreground">Hub</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSearchClick}
            className="text-muted-foreground hover:text-foreground"
          >
            <Search className="h-5 w-5" />
          </Button>
          
          <NotificationsDropdown />
          
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-muted-foreground hover:text-foreground"
          >
            <Link to="/">
              <Home className="h-5 w-5 mr-2" />
              Home
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
