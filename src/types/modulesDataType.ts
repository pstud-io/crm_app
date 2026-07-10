import { ReactElement } from "react";
import { ReactNativeElement } from "react-native";

export interface ModuleData {
  id: string;
  label: string;
  name: string;
  component: ReactElement | null;
  icon: (isActive: boolean) => React.ReactElement;
  permission: string;
  show: string;
  onPress: () => void | Promise<void> | null;
}

export type ModulesDataType = {
  pipelineData: ModuleData[];
  actionsData: ModuleData[];
};
