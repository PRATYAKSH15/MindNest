import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1"
        >
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            MindNest — Your <span className="text-primary">Mental Health</span> Companion
          </h1>
          <p className="mt-6 text-lg opacity-80">
            MindNest is a curated hub of self-help resources, community discussions, 
            and mindful living guides. We connect people with the tools they need to improve 
            emotional well-being and break the stigma around mental health.
          </p>
          <div className="mt-8 flex gap-4">
            <Link to="/articles">
              <Button size="lg">Explore Resources</Button>
            </Link>
            <Link to="/admin">
              <Button size="lg" variant="outline">
                Admin Access
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1"
        >
          <img
            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b"
            alt="Mental Health Illustration"
            className="rounded-lg shadow-lg"
          />
        </motion.div>
      </section>

      {/* Social Impact Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Why MindNest Matters
          </h2>
          <p className="max-w-2xl mx-auto text-lg opacity-80 mb-12">
            Mental health challenges affect 1 in 4 people worldwide, yet stigma prevents many from seeking help. 
            MindNest empowers individuals with knowledge, encourages open conversations, and fosters a community 
            of empathy, hope, and growth.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <ImpactCard
              number="500+"
              text="Curated Articles on Mindfulness, Stress & Anxiety"
            />
            <ImpactCard
              number="10K+"
              text="People Reached Across Communities"
            />
            <ImpactCard
              number="100+"
              text="Contributors Sharing Personal Stories"
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Join the Movement
          </h2>
          <p className="max-w-xl mx-auto mb-8 opacity-80">
            Together, we can make mental health conversations as normal as talking about the weather. 
            Start by exploring our resources or contributing your own story.
          </p>
          <Link to="/articles">
            <Button size="lg">Get Started</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function ImpactCard({ number, text }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-card p-6 rounded-lg shadow-md"
    >
      <h3 className="text-4xl font-bold text-primary">{number}</h3>
      <p className="mt-4 opacity-80">{text}</p>
    </motion.div>
  );
}
