"use client";

import { CopilotType, createCopilot } from "@/data/copilot";
import { useWizard } from "react-use-wizard";
import { useCreateCopilot } from "./CreateCopilotProvider";
import { useAsyncFn } from "react-use";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function SetCopilotName() {
  const {
    state: { copilot_name, createdCopilot },
    dispatch,
  } = useCreateCopilot();
  const { nextStep } = useWizard();
  const [value, $createCopilot] = useAsyncFn(createCopilot);
  const setCopilot = (copilot: CopilotType) => {
    dispatch({ type: "SET_COPILOT", payload: copilot });
  };

  async function handleCreateCopilot() {
    if (!copilot_name) {
      toast.message("Please enter copilot name");
      return;
    }
    if (createdCopilot) {
      nextStep();
      return;
    }
    const response = await $createCopilot(copilot_name);
    if (response?.data?.id) {
      setCopilot(response.data);
      nextStep();
    } else {
      toast.error("Failed to create copilot");
    }
  }
  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold text-accent-foreground">
        Let's give your copilot a name 🤖
      </h2>
      <div className="my-4 px-2">
        <Label htmlFor="copilotName" className="font-semibold">
          Copilot Name
        </Label>
        <Input
          id="copilotName"
          disabled={!!createdCopilot}
          className="mt-1"
          value={copilot_name}
          onChange={(ev) =>
            dispatch({ type: "CHANGE_NAME", payload: ev.target.value })
          }
        />
      </div>
      <div className="flex items-center justify-end">
        <Button
          onClick={handleCreateCopilot}
          disabled={!copilot_name}
          loading={value.loading}
          className="bg-[#2e87d9] text-white hover:bg-[#0c66b9]"
        >
          Let's do it!
        </Button>
      </div>
    </div>
  );
}
