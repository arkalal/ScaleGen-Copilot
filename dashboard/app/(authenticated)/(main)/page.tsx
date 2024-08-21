import { Button } from "@/components/ui/button";
import * as React from "react";
import { XIcon } from "lucide-react";
import {
  ClosableDiv,
  ClosableDivProvider,
  CloseBtn,
} from "@/components/headless/ClosableDiv";
import { HeaderShell } from "@/components/domain/HeaderShell";
import { Search } from "./_parts/Search";
import { Link } from "@/lib/router-events";
import { CopilotsContainer } from "./_parts/CopilotsContainer";
import Image from "next/image";
import scaleGenImage from "../../../assets/images/logo_blue.png";

export default async function HomePage() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <HeaderShell>
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="flex gap-3 text-lg font-bold text-accent-foreground">
              <Image src={scaleGenImage} width={150} height={150} alt="" />{" "}
              <span className="text-xl">Copilots</span> ✨
            </h1>
          </div>
          <div className="space-x-2">
            <Button
              className="bg-[#2e87d9] text-white hover:bg-[#0c66b9]"
              asChild
            >
              <Link href="/create/copilot">Create Copilot</Link>
            </Button>
          </div>
        </div>
      </HeaderShell>

      <div className="flex-1 overflow-auto p-8 pt-4">
        <ClosableDivProvider>
          <ClosableDiv className="group relative mb-2 w-full overflow-hidden rounded-lg bg-[#d8ecff] px-8 py-6 before:absolute before:-bottom-5 before:right-14 before:-z-10 before:aspect-square before:h-full before:w-auto before:-rotate-45">
            <div className="flex items-center justify-between gap-5">
              <div>
                <h1 className="text-lg font-bold text-accent-foreground">
                  Welcome to ScaleGenAI Copilot!
                </h1>
                <p className="line-clamp-1">
                  You’ll find everything you need to get started with ScaleGenAI
                  Copilot from the ground up.
                </p>
              </div>
              <Button asChild>
                {/* <Link href="https://opencopilot.so/#tuts">Learn</Link> */}
              </Button>
            </div>
            <CloseBtn className="absolute -right-1 -top-1 rounded-full border border-border bg-white p-1 opacity-0 shadow group-hover:opacity-100 ">
              <XIcon className="h-4 w-4" />
            </CloseBtn>
          </ClosableDiv>
        </ClosableDivProvider>
        <Search />
        <CopilotsContainer />
      </div>
    </div>
  );
}
