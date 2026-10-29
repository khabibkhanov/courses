import { getCourse, getLesson } from "@/lib/content";
import { OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export { generateStaticParams } from "./page";

export default async function Image({ params }: { params: Promise<{ course: string; n: string }> }) {
  const { course: slug, n } = await params;
  const course = getCourse(slug);
  const lesson = course ? getLesson(course, Number(n)) : null;
  return ogImage({ eyebrow: `${course?.title ?? ""}, ${n}-dars`, title: lesson?.title ?? "", color: course?.color });
}
