import Image from "next/image";
import React from "react";
import scaleGenLogo from "../../assets/images/sg-logo.png";

export function Logo() {
  return (
    <div className="w-100 relative flex aspect-square justify-center">
      <Image src={scaleGenLogo} alt="" className="" width={40} height={40} />
    </div>
  );
}
