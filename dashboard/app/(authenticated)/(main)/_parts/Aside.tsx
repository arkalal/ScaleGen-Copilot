import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Github, PlaySquare } from "lucide-react";
import { Link } from "@/lib/router-events";
import { Logo } from "@/components/domain/Logo";
import { Tooltip } from "@/components/domain/Tooltip";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CopilotLayoutNavLink } from "../../(copilot)/_parts/CopilotNavLink";

export default function Aside() {
  return (
    <aside className="flex h-full w-header flex-col justify-between overflow-hidden border-r border-border bg-primary-foreground">
      <Link
        href="/"
        className="flex-center h-header w-full border-b border-r border-border bg-primary-foreground"
      >
        <Logo />
      </Link>

      <div className="h-full w-full flex-1 space-y-4 overflow-auto px-0 py-4">
        <div className="flex flex-col items-center gap-2 space-y-1 p-2">
          <CopilotLayoutNavLink IconComponent={Bot} label="Copilots" href="/" />

          <Tooltip content={<>Tutorials</>} side="right">
            <Link
              href="https://www.scalegen.ai/"
              target="_blank"
              className={cn(
                "text-accent-foreground/50 hover:bg-accent hover:text-primary",
                buttonVariants({ size: "icon", variant: "link" }),
              )}
            >
              <PlaySquare className="h-5 w-5" />
            </Link>
          </Tooltip>
          <Tooltip content={<>Tutorials</>} side="right">
            <Link
              href="https://github.com/arkalal/ScaleGen-Copilot?tab=readme-ov-file"
              target="_blank"
              className={cn(
                "text-accent-foreground/50 hover:bg-accent hover:text-primary",
                buttonVariants({ size: "icon", variant: "link" }),
              )}
            >
              <Github className="h-5 w-5" />
            </Link>
          </Tooltip>
        </div>
      </div>

      <div className="flex-center border-t border-border px-5 py-2">
        <Tooltip content="Local User" side="right">
          <Avatar size="large">
            <AvatarFallback className="bg-accent">LA</AvatarFallback>
          </Avatar>
        </Tooltip>
      </div>
    </aside>
  );
}
