"use client";
import { atom, useAtom } from "jotai";
import { useAsyncFn } from "react-use";
import { useWizard } from "react-use-wizard";
import { revalidateActions, useCreateCopilot } from "./CreateCopilotProvider";
import useSWR from "swr";
import _ from "lodash";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { createActionByBotId, getActionsByBotId } from "@/data/actions";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, UploadCloud } from "lucide-react";
import { EmptyBlock } from "@/components/domain/EmptyBlock";
import { ActionForm } from "@/components/domain/action-form/ActionForm";
import { methodVariants } from "@/components/domain/MethodRenderer";
import { cn } from "@/lib/utils";
import { GetActionsFromSwagger } from "@/components/domain/SwaggerUpload";
import { useSwaggerAdd } from "@/hooks/useAddSwagger";
import { toast } from "sonner";

const formDialog = atom({
  swagger: false,
  manually: false,
});

export function DefineActionsStep() {
  const { nextStep, previousStep } = useWizard();
  const [addActionState, $addAction] = useAsyncFn(createActionByBotId);
  const {
    state: { swaggerFiles, createdCopilot },
    dispatch,
  } = useCreateCopilot();
  const [state, addSwagger] = useSwaggerAdd({ copilotId: createdCopilot?.id });
  const [dialogs, setDialogs] = useAtom(formDialog);
  const { data: actions } = useSWR(
    createdCopilot ? createdCopilot?.id + "/actions" : null,
    async () =>
      createdCopilot?.id ? await getActionsByBotId(createdCopilot?.id) : null,
  );

  async function addActionFromSwagger() {
    const swaggerFile = _.first(swaggerFiles);
    if (swaggerFile && createdCopilot) {
      addSwagger({
        swagger: swaggerFile,
        onSuccess(data) {
          dispatch({
            type: "ADD_SWAGGER",
            payload: [],
          });
          revalidateActions(createdCopilot.id);
          setDialogs({
            ...dialogs,
            swagger: false,
          });
        },
        onError(data) {
          dispatch({
            type: "ADD_SWAGGER",
            payload: [],
          });
        },
      });
    }
  }
  return (
    <div className="relative p-1">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-accent-foreground">
          Define your actions ✨
        </h2>
      </div>

      <p className="mb-2">
        You copilot will use these APIs to communicate with your product and
        execute actions
      </p>
      <div className="mb-2 flex items-center justify-end space-x-2">
        {/* Via Form */}
        <AlertDialog
          open={dialogs.manually}
          onOpenChange={(open) =>
            setDialogs({
              ...dialogs,
              manually: open,
            })
          }
        >
          <AlertDialogContent>
            <AlertDialogHeader className="flex w-full flex-row items-center justify-between">
              <AlertDialogTitle className="flex-1 text-lg font-bold">
                Define API action
              </AlertDialogTitle>
            </AlertDialogHeader>
            <ActionForm
              className="no-scrollbar flex-1 space-y-2.5 overflow-auto"
              onSubmit={async (values) => {
                if (createdCopilot) {
                  const { data } = await $addAction(createdCopilot.id, values);
                  if (data) {
                    toast.success("Action created successfully");
                    setDialogs({
                      ...dialogs,
                      manually: false,
                    });
                    revalidateActions(createdCopilot.id);
                  }
                }
              }}
              footer={() => (
                <AlertDialogFooter className="mt-5">
                  <AlertDialogCancel asChild>
                    <Button variant="outline">Cancel</Button>
                  </AlertDialogCancel>
                  <Button type="submit" loading={addActionState.loading}>
                    Create Action
                  </Button>
                </AlertDialogFooter>
              )}
            />
          </AlertDialogContent>
          <AlertDialogTrigger asChild>
            <Button className="space-x-1" size="xs" variant="secondary">
              <Plus className="h-4 w-4" />
              <span>Add action manually</span>
            </Button>
          </AlertDialogTrigger>
        </AlertDialog>
        {/* Via swagger Def file */}
        <AlertDialog
          open={dialogs.swagger}
          onOpenChange={(open) =>
            setDialogs({
              ...dialogs,
              swagger: open,
            })
          }
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex-1 text-lg font-bold">
                Import from Swagger
              </AlertDialogTitle>
            </AlertDialogHeader>
            <GetActionsFromSwagger
              swaggerFiles={swaggerFiles || []}
              onChange={(f) => {
                dispatch({
                  type: "ADD_SWAGGER",
                  payload: f,
                });
              }}
            />
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button variant="outline">Cancel</Button>
              </AlertDialogCancel>
              <Button onClick={addActionFromSwagger} loading={state.loading}>
                Import
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
          <AlertDialogTrigger asChild>
            <Button className="space-x-1" size="xs" variant="secondary">
              <UploadCloud className="h-4 w-4" />
              <span>Import actions from Swagger file</span>
            </Button>
          </AlertDialogTrigger>
        </AlertDialog>
      </div>
      <div className="flex max-h-60 flex-col items-start gap-2 overflow-auto px-2 py-1">
        {_.isEmpty(actions?.data) ? (
          <div className="mx-auto">
            <EmptyBlock>
              <div className="text-center text-sm">
                <span className="block">No actions added yet.</span>
                <span className="block">
                  You can add one manually or import a bunch from swagger file
                </span>
              </div>
            </EmptyBlock>
          </div>
        ) : (
          _.map(actions?.data, (endpoint, index) => {
            return (
              <div
                key={index}
                className="flex w-full max-w-full shrink-0 items-center justify-between gap-4 overflow-hidden rounded-lg border border-border p-2 transition-colors"
              >
                <div className="flex flex-1 shrink-0 items-center justify-start overflow-hidden">
                  <div className="flex shrink-0 items-center gap-5 overflow-hidden">
                    <span
                      className={cn(
                        methodVariants({
                          method: endpoint.request_type,
                        }),
                      )}
                    >
                      {endpoint.request_type}
                    </span>
                    <p className="line-clamp-1 flex-1 overflow-ellipsis text-xs font-medium">
                      {endpoint.name || endpoint.api_endpoint}
                    </p>
                  </div>
                </div>
                <div className="space-x-2">
                  <button className="text-destructive">
                    <Trash2
                      className="h-4 w-4"
                      onClick={() => confirm("are you sure")}
                    />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <footer className="flex w-full items-center justify-between gap-5 pt-5">
        <Button
          variant="ghost"
          onClick={previousStep}
          className="flex items-center justify-center gap-1 underline"
        >
          Back
        </Button>
        {createdCopilot && (
          <Button
            variant="ghost"
            className="flex items-center justify-center gap-1 underline"
            onClick={nextStep}
          >
            {_.isEmpty(actions?.data) ? "Skip for now ►" : "Next"}
          </Button>
        )}
      </footer>
    </div>
  );
}
