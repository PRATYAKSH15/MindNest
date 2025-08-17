import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ContactUs from "../components/ContactUs"; // 👈 import new component

function ImpactCard({ number, text }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="bg-background rounded-xl p-6 shadow-md hover:shadow-lg"
    >
      <h3 className="text-3xl font-bold text-primary mb-2">{number}</h3>
      <p className="opacity-80">{text}</p>
    </motion.div>
  );
}

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
            MindNest — Your <span className="text-primary">Mental Health</span>{" "}
            Companion
          </h1>
          <p className="mt-6 text-lg opacity-80">
            MindNest is a curated hub of self-help resources, community
            discussions, and mindful living guides. We connect people with the
            tools they need to improve emotional well-being and break the stigma
            around mental health.
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

      {/* About Us Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="https://images.unsplash.com/photo-1620147461831-a97b99ade1d3?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Team working together"
              className="rounded-2xl shadow-xl"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About Us</h2>
            <p className="text-lg opacity-80 mb-4">
              At <span className="text-primary font-semibold">MindNest</span>,
              we believe that mental health is just as important as physical
              health. Our mission is to create a safe space where people can
              access resources, share stories, and feel less alone in their
              journey.
            </p>
            <p className="text-lg opacity-80 mb-6">
              We are a team of mental health advocates, developers, and
              community builders working together to make well-being resources
              accessible and stigma-free.
            </p>
            <Button size="lg" asChild>
              <Link to="/about">Learn More</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Social Impact Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Why MindNest Matters</h2>
          <p className="max-w-2xl mx-auto text-lg opacity-80 mb-12">
            Mental health challenges affect 1 in 4 people worldwide, yet stigma
            prevents many from seeking help. MindNest empowers individuals with
            knowledge, encourages open conversations, and fosters a community of
            empathy, hope, and growth.
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
          <h2 className="text-3xl font-bold mb-4">Join the Movement</h2>
          <p className="max-w-xl mx-auto mb-8 opacity-80">
            Together, we can make mental health conversations as normal as
            talking about the weather. Start by exploring our resources or
            contributing your own story.
          </p>
          <Link to="/articles">
            <Button size="lg">Get Started</Button>
          </Link>
        </div>
      </section>

      {/* Contact Us Section */}
      <ContactUs />
    </div>
  );
}

// import { Button } from "@/components/ui/button";
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";

// export default function LandingPage() {
//   return (
//     <div className="bg-background text-foreground">
//       {/* Hero Section */}
//       <section className="container mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12">
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="flex-1"
//         >
//           <h1 className="text-4xl md:text-6xl font-bold leading-tight">
//             MindNest — Your <span className="text-primary">Mental Health</span> Companion
//           </h1>
//           <p className="mt-6 text-lg opacity-80">
//             MindNest is a curated hub of self-help resources, community discussions,
//             and mindful living guides. We connect people with the tools they need to improve
//             emotional well-being and break the stigma around mental health.
//           </p>
//           <div className="mt-8 flex gap-4">
//             <Link to="/articles">
//               <Button size="lg">Explore Resources</Button>
//             </Link>
//             <Link to="/admin">
//               <Button size="lg" variant="outline">
//                 Admin Access
//               </Button>
//             </Link>
//           </div>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, x: 40 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.8 }}
//           className="flex-1"
//         >
//           <img
//             src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b"
//             alt="Mental Health Illustration"
//             className="rounded-lg shadow-lg"
//           />
//         </motion.div>
//       </section>

//       {/* Features Section */}
//       <section className="py-16">
//         <div className="container mx-auto px-6 text-center">
//           <h2 className="text-3xl font-bold mb-6">What You’ll Find</h2>
//           <div className="grid md:grid-cols-3 gap-8">
//             <FeatureCard
//               title="Self-Assessment Tools"
//               text="Take quick quizzes like PHQ-9 and GAD-7 to reflect on your mental well-being."
//             />
//             <FeatureCard
//               title="Curated Resources"
//               text="Access expert articles, coping guides, and lifestyle tips for daily balance."
//             />
//             <FeatureCard
//               title="Community Support"
//               text="Join discussions, share stories, and know you’re never alone in your journey."
//             />
//           </div>
//         </div>
//       </section>

//       {/* Social Impact Section */}
//       <section className="bg-muted py-16">
//         <div className="container mx-auto px-6 text-center">
//           <h2 className="text-3xl font-bold mb-6">Why MindNest Matters</h2>
//           <p className="max-w-2xl mx-auto text-lg opacity-80 mb-12">
//             Mental health challenges affect 1 in 4 people worldwide, yet stigma prevents many from seeking help.
//             MindNest empowers individuals with knowledge, encourages open conversations, and fosters a community
//             of empathy, hope, and growth.
//           </p>

//           <div className="grid md:grid-cols-3 gap-8">
//             <ImpactCard
//               number="500+"
//               text="Curated Articles on Mindfulness, Stress & Anxiety"
//             />
//             <ImpactCard
//               number="10K+"
//               text="People Reached Across Communities"
//             />
//             <ImpactCard
//               number="100+"
//               text="Contributors Sharing Personal Stories"
//             />
//           </div>
//         </div>
//       </section>

//       {/* How It Works Section */}
//       <section className="py-16">
//         <div className="container mx-auto px-6 text-center">
//           <h2 className="text-3xl font-bold mb-6">How It Works</h2>
//           <div className="grid md:grid-cols-3 gap-8">
//             <StepCard step="1" text="Explore self-help articles and tools tailored to your needs." />
//             <StepCard step="2" text="Join the community to connect with people who understand." />
//             <StepCard step="3" text="Track your progress and take control of your mental well-being." />
//           </div>
//         </div>
//       </section>

//       {/* Testimonials Section */}
//       <section className="bg-muted py-16">
//         <div className="container mx-auto px-6 text-center">
//           <h2 className="text-3xl font-bold mb-6">What People Say</h2>
//           <div className="grid md:grid-cols-2 gap-8">
//             <TestimonialCard
//               name="Aarav"
//               text="MindNest helped me find daily coping strategies. The community stories made me feel less alone."
//             />
//             <TestimonialCard
//               name="Meera"
//               text="The self-assessment quizzes gave me the clarity I needed to seek professional support."
//             />
//           </div>
//         </div>
//       </section>

//       {/* Call to Action */}
//       <section className="py-16">
//         <div className="container mx-auto px-6 text-center">
//           <h2 className="text-3xl font-bold mb-4">Join the Movement</h2>
//           <p className="max-w-xl mx-auto mb-8 opacity-80">
//             Together, we can make mental health conversations as normal as talking about the weather.
//             Start by exploring our resources or contributing your own story.
//           </p>
//           <Link to="/articles">
//             <Button size="lg">Get Started</Button>
//           </Link>
//         </div>
//       </section>
//     </div>
//   );
// }

// /* Reusable Components */
// function ImpactCard({ number, text }) {
//   return (
//     <motion.div whileHover={{ scale: 1.05 }} className="bg-card p-6 rounded-lg shadow-md">
//       <h3 className="text-4xl font-bold text-primary">{number}</h3>
//       <p className="mt-4 opacity-80">{text}</p>
//     </motion.div>
//   );
// }

// function FeatureCard({ title, text }) {
//   return (
//     <motion.div whileHover={{ scale: 1.05 }} className="bg-card p-6 rounded-lg shadow-md">
//       <h3 className="text-xl font-semibold">{title}</h3>
//       <p className="mt-2 opacity-80">{text}</p>
//     </motion.div>
//   );
// }

// function StepCard({ step, text }) {
//   return (
//     <motion.div whileHover={{ scale: 1.05 }} className="bg-card p-6 rounded-lg shadow-md">
//       <h3 className="text-2xl font-bold text-primary">Step {step}</h3>
//       <p className="mt-2 opacity-80">{text}</p>
//     </motion.div>
//   );
// }

// function TestimonialCard({ name, text }) {
//   return (
//     <motion.div whileHover={{ scale: 1.02 }} className="bg-card p-6 rounded-lg shadow-md">
//       <p className="italic opacity-80">“{text}”</p>
//       <h4 className="mt-4 font-semibold">— {name}</h4>
//     </motion.div>
//   );
// }
