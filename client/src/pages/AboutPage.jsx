import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function ProblemCard({ title, description }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="bg-background p-6 rounded-2xl shadow-md hover:shadow-xl"
    >
      <h3 className="text-xl font-semibold text-primary mb-3">{title}</h3>
      <p className="text-base opacity-80">{description}</p>
    </motion.div>
  );
}

function SolutionCard({ title, description }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 150 }}
      className="bg-muted p-6 rounded-2xl shadow-md hover:shadow-lg"
    >
      <h3 className="text-xl font-semibold text-primary mb-3">{title}</h3>
      <p className="text-base opacity-80">{description}</p>
    </motion.div>
  );
}

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          About <span className="text-primary">MindNest</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl mx-auto text-lg opacity-80"
        >
          We started MindNest with one belief: mental health should be
          accessible, stigma-free, and part of everyday conversations. Our
          platform bridges the gap between awareness and action.
        </motion.p>
      </section>

      {/* The Problem Section */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-12"
          >
            The Real Problems
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            <ProblemCard
              title="Stigma & Silence"
              description="Millions struggle silently due to the stigma attached to seeking mental health support."
            />
            <ProblemCard
              title="Information Overload"
              description="The internet is full of resources, but most people don’t know what’s credible or helpful."
            />
            <ProblemCard
              title="Lack of Community"
              description="Many people feel isolated, believing they’re alone in their struggles."
            />
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-12"
          >
            Our Solutions
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            <SolutionCard
              title="Curated Resources"
              description="We provide expert-backed articles, guides, and tools designed to make mental health knowledge practical and accessible."
            />
            <SolutionCard
              title="Community Support"
              description="Through discussions and shared stories, MindNest creates a safe space where people realize they’re not alone."
            />
            <SolutionCard
              title="Breaking the Stigma"
              description="By normalizing conversations, we aim to make seeking help as natural as talking about physical health."
            />
          </div>
        </div>
      </section>

      {/* Vision / CTA Section */}
      <section className="bg-gradient-to-b from-background to-muted py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Our Vision
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto text-lg opacity-80 mb-8"
          >
            We dream of a world where mental health care is accessible to
            everyone, conversations are stigma-free, and communities empower one
            another to heal and grow.
          </motion.p>

          <Button size="lg" asChild>
            <Link to="/articles">Explore Our Resources</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
