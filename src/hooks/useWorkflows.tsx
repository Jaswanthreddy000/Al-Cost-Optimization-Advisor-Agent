
import { useWorkflowSave } from './workflow/useWorkflowSave';
import { useWorkflowLoad } from './workflow/useWorkflowLoad';
import { useWorkflowOperations } from './workflow/useWorkflowOperations';

export * from './workflow/types';

export const useWorkflows = () => {
  const { saveWorkflow, loading: saveLoading } = useWorkflowSave();
  const { loadWorkflow, loading: loadLoading } = useWorkflowLoad();
  const { workflows, loading: operationsLoading, deleteWorkflow, refetch } = useWorkflowOperations();

  const loading = saveLoading || loadLoading || operationsLoading;

  return {
    workflows,
    loading,
    saveWorkflow,
    loadWorkflow,
    deleteWorkflow,
    refetch
  };
};