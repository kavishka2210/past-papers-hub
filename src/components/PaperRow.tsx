import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaperRowProps {
  year: number;
  paperUrl?: string | null;
  markingSchemeUrl?: string | null;
  delay?: number;
}

const PaperRow = ({ year, paperUrl, markingSchemeUrl, delay = 0 }: PaperRowProps) => {
  return (
    <div 
      className="flex items-center gap-4 py-3 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="text-lg font-medium text-muted-foreground w-16">{year}</span>
      <div className="flex gap-3">
        <Button
          variant="secondary"
          size="sm"
          className="bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          onClick={() => paperUrl && window.open(paperUrl, "_blank")}
          disabled={!paperUrl}
        >
          <Download className="h-4 w-4 mr-2" />
          Past Paper
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          onClick={() => markingSchemeUrl && window.open(markingSchemeUrl, "_blank")}
          disabled={!markingSchemeUrl}
        >
          <Download className="h-4 w-4 mr-2" />
          Marking Scheme
        </Button>
      </div>
    </div>
  );
};

export default PaperRow;
