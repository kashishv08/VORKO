import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight, Briefcase, Users } from "lucide-react";
import Image from "next/image";

export type UserPublicMetadata = {
  role?: "FREELANCER" | "CLIENT";
  onboardingComplete?: boolean;
};

export function Hero() {
  const { user } = useUser();
  const publicMetadata = (user?.publicMetadata as UserPublicMetadata) ?? {};
  const onboard = publicMetadata.onboardingComplete;

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center h-[100vh] w-[100%]">
        <Image
          src="/cover.png"
          alt="Cover"
          fill
          style={{ objectFit: "cover" }} // cover, contain, etc.
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      <div className="relative z-5 max-w-7xl mx-auto px-6 py-20 text-center">
        <h1
          className="text-5xl md:text-6xl font-bold text-white mb-6"
          data-testid="text-hero-title"
        >
          Welcome to VORKO
        </h1>
        <p
          className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto"
          data-testid="text-hero-subtitle"
        >
          The professional freelancing platform where talent meets opportunity
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {!onboard ? (
            <>
              <Link href="/sign-up?role=CLIENT" data-testid="link-join-client">
                <Button
                  size="lg"
                  className="cursor-pointer min-w-[200px] -foreground border border-primary-border"
                  style={{
                    backgroundColor: "rgb(34, 197, 94)",
                  }}
                >
                  <Briefcase className="mr-2 h-5 w-5" />
                  Join as Client
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link
                href="/sign-up?role=FREELANCER"
                data-testid="link-join-freelancer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="cursor-pointer min-w-[200px] bg-background/10 backdrop-blur-sm hover:bg-background/20 text-white border-white/30"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Join as Freelancer
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </section>
  );
}
