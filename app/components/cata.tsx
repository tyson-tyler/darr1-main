// components/CTAImage.tsx
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

type Props = {
  href: string;
  src: string;
  alt: string;
  className?: string; // extra padding/margins if you need
  priority?: boolean;
};

export default function CTAImage({ href, src, alt, className, priority }: Props) {
  return (
    <Link
      href={href}
      className={clsx(
        "block group overflow-hidden rounded-2xl",
        "shadow-lg hover:shadow-xl transition-shadow duration-300",
        className
      )}
      aria-label={alt}
    >
      {/* Aspect wrapper keeps it responsive */}
      <div className="relative w-full aspect-[21/9] sm:aspect-[16/9] md:aspect-[3/1]">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw,
                 (max-width: 1024px) 100vw,
                 1200px"
        />
      </div>
    </Link>
  );
}
