import Image from "next/image";
import darkLogo from "../../../public/logo/buildlink-logo.png";
import logo from "../../../public/logo/buildlink-black-logo.png";

export default function BuildlinkLogo({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Image
        src={darkLogo}
        className="hidden dark:block"
        alt="BuildLink"
        width={150}
        height={32}
      />
      <Image
        src={logo}
        className="dark:hidden"
        alt="BuildLink"
        width={150}
        height={32}
      />
    </div>
  );
}
