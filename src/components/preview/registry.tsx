import type { ReactElement } from "react";
import DialogPreview from "@/components/preview/DialogPreview";
import ButtonPreview from "@/components/preview/ButtonPreview";
import SheetPreview from "@/components/preview/SheetPreview";
import TabsPreview from "@/components/preview/TabsPreview";
import LoginPreview from "@/components/preview/LoginPreview";
import { defaultDialogDesign } from "@/lib/design/dialog";
// Add new entries here as you build more previews.
type Entry = { title: string; render: () => ReactElement };

export const PREVIEW_REGISTRY: Record<string, Entry> = {
  dialog: {
    title: "Dialog",
    render: () => <DialogPreview design={defaultDialogDesign} />,
  },
  button: { title: "Button", render: () => <ButtonPreview /> },
  sheet: { title: "Sheet", render: () => <SheetPreview /> },
  tabs: { title: "Tabs", render: () => <TabsPreview /> },
  login: { title: "Login", render: () => <LoginPreview /> },
};

// If you have "simple" vs "functional" kinds, you can annotate later.
// For now, slug keys must match your card hrefs (e.g., /preview/button).
