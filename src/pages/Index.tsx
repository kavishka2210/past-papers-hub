import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard";
import SearchModal from "@/components/SearchModal";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const [searchOpen, setSearchOpen] = useState(false);

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onSearchClick={() => setSearchOpen(true)} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28">
          <div className="container text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 animate-fade-in">
              A/L Past Papers
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "100ms" }}>
              Simple resources for A/L Technology students
            </p>
          </div>
        </section>

        {/* Categories Section */}
        <section className="pb-20">
          <div className="container">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-12 animate-fade-in">
              Past Papers
            </h2>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-48 bg-card" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {categories?.map((category, index) => (
                  <CategoryCard
                    key={category.id}
                    id={category.id}
                    name={category.name}
                    description={category.description || ""}
                    paperCount={category.paper_count || 0}
                    delay={index * 100}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
};

export default Index;
