import BuildlinkLogo from "@/components/common/buildlink-logo";
import NearWalletButton from "@/components/common/near-wallet-button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

export default function ChatHeader() {
  const { open } = useSidebar();
  return (
    <div className="flex justify-between items-center px-4 py-2 border-b w-full">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          {!open && <BuildlinkLogo />}
        </div>
      </div>
      <NearWalletButton />
    </div>
  );
}
