import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface CategoryCardProps {
  id: string;
  name: string;
  description: string;
  paperCount: number;
  delay?: number;
}

const CategoryCard = ({ id, name, description, paperCount, delay = 0 }: CategoryCardProps) => {
  return (
    <Card 
      className="group border-border bg-card hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="pt-6 text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground mb-1">GCE A/L</p>
        <p className="text-sm text-muted-foreground">
          {paperCount} papers available
        </p>
      </CardContent>
      <CardFooter className="justify-center pb-6">
        <Button
          variant="outline"
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          asChild
        >
          <Link to={`/papers/${id}`}>Get Papers</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CategoryCard;
