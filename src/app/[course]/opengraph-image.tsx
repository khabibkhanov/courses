import { getCourse } from "@/lib/content";
import { OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export { generateStaticParams } from "./page";

export default async function Image({ params }: { params: Promise<{ course: string }> }) {
  const course = getCourse((await params).course);
  return ogImage({ eyebrow: course?.subtitle ?? "", title: course?.title ?? "", color: course?.color });
}
