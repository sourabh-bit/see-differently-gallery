import { createFileRoute } from "@tanstack/react-router";

import { InfoPageShell } from "@/components/InfoPageShell";

export const Route = createFileRoute("/course")({
  head: () => ({
    meta: [
      { title: "Course - See Differently" },
      {
        name: "description",
        content:
          "Course details for the See Differently mobile photography masterclass, including format, schedule, and what is included.",
      },
    ],
  }),
  component: CoursePage,
});

function CoursePage() {
  return (
    <InfoPageShell
      eyebrow="Course details"
      title="Course overview"
      lead="A practical live session to sharpen your eye, improve your compositions, and create stronger images with your phone."
    >
      <div className="max-w-3xl space-y-5 text-sm leading-7 text-paper/75 md:text-base">
        <p>
          The course is structured as an intimate masterclass rather than a general workshop. The
          goal is to move beyond basic camera settings and help participants understand how to
          notice{" "}
          <strong className="underline decoration-paper/40 underline-offset-4">
            light, shape, rhythm, and visual tension
          </strong>{" "}
          in everyday scenes. The session combines demonstration, guided practice, and feedback so
          that each concept is shown in context rather than only explained in theory.
        </p>
        <p>
          We start with the core habits that make a photograph feel intentional. That includes
          learning how to slow down before you shoot, how to simplify a frame, and how to identify
          what should be included or removed from an image.{" "}
          <strong className="underline decoration-paper/40 underline-offset-4">
            Small choices in angle, distance, timing, and perspective
          </strong>{" "}
          can completely change the feeling of a photograph, and the masterclass is designed to make
          those choices easier to see and use.
        </p>
        <p>
          A major part of the course is composition. Instead of relying on templates or filters, you
          will learn how to build a frame with balance, contrast, negative space, lines, repetition,
          and gesture. We also discuss how to work with natural light, shade, and reflections so the
          image feels clean and deliberate without looking over-processed.
        </p>
        <p>
          The editing section focuses on a restrained mobile workflow. The aim is not to turn a
          photo into something artificial, but to refine what is already there. You will see how a
          simple sequence of adjustments can improve{" "}
          <strong className="underline decoration-paper/40 underline-offset-4">
            tone, mood, and clarity
          </strong>{" "}
          while keeping the image believable. The approach is minimal, repeatable, and easy to apply
          after the class.
        </p>
        <p>
          Participants are also shown how to create a consistent visual language across a series of
          images. That means thinking not only about a single frame, but also about how multiple
          photographs relate to one another in a body of work. This is especially useful for
          creators, small brands, and anyone who wants their images to feel more editorial and more
          cohesive.
        </p>
        <p>
          The class is suitable for beginners as well as photographers who already shoot regularly
          on mobile. Beginners get a clear foundation without jargon, while more experienced
          participants get a sharper way of seeing and reviewing their own work. The session is
          practical enough to be immediately useful, but thoughtful enough to change how you
          approach image-making afterward.
        </p>
        <p>
          After the live session, attendees receive replay access so they can revisit the material
          and review the examples at their own pace. We keep the experience compact and focused,
          with the intention that every section supports the next one. The result is a masterclass
          that feels{" "}
          <strong className="underline decoration-paper/40 underline-offset-4">
            premium, calm, and useful
          </strong>{" "}
          instead of crowded or overly complicated.
        </p>
      </div>
    </InfoPageShell>
  );
}
