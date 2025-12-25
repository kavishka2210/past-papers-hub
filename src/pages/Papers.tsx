import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PaperRow from "@/components/PaperRow";
import SearchModal from "@/components/SearchModal";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const Papers = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchOpen, setSearchOpen] = useState(false);

  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("id", categoryId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!categoryId,
  });

  const { data: papers, isLoading: papersLoading } = useQuery({
    queryKey: ["papers", categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("papers")
        .select("*")
        .eq("category_id", categoryId)
        .order("year", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!categoryId,
  });

  const isLoading = categoryLoading || papersLoading;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onSearchClick={() => setSearchOpen(true)} />

      <main className="flex-1 py-12">
        <div className="container max-w-3xl">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="mb-8 text-muted-foreground hover:text-foreground"
          >
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-64 bg-card" />
              <Skeleton className="h-6 w-48 bg-card" />
              <div className="space-y-3 mt-8">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 bg-card" />
                ))}
              </div>
            </div>
          ) : category ? (
            <>
              <div className="mb-8 animate-fade-in">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Past Papers
                </h1>
                <p className="text-muted-foreground">
                  GCE A/L Technology Stream
                </p>
              </div>

              <div className="border-l-4 border-primary pl-4 mb-8 animate-slide-up">
                <h2 className="text-xl font-semibold text-foreground">
                  {category.name}
                </h2>
              </div>

              <div className="space-y-1">
                {papers?.map((paper, index) => (
                  <PaperRow
                    key={paper.id}
                    year={paper.year}
                    paperUrl={paper.paper_url}
                    markingSchemeUrl={paper.marking_scheme_url}
                    delay={index * 50}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Category not found</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
};

export default Papers;
