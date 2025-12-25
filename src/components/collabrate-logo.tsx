import Image from "next/image";
import type { ComponentPropsWithoutRef } from "react";

export function CollabrateLogo(props: ComponentPropsWithoutRef<typeof Image>) {
  return (
    <Image
      src="/collabrate.png"
      alt="Collabrate"
      width={128}
      height={128}
      {...props}
    />
  );
}
