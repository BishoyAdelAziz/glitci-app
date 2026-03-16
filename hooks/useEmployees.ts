import {
  addEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
} from "@/services/api/employees";
import { EmployeesQueryParams } from "@/types/employees";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AddEmployeeFormFIelds } from "@/services/validations/employees";
export default function useEmployees(params?: EmployeesQueryParams) {
  const queryCLient = useQueryClient();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["employees", params],
    queryFn: () => getEmployees(params),
  });
  const {
    mutate: AddEmployeeMutation,
    isError: AddEmployeeIsError,
    isPending: AddEmpoyeeIsPending,
    error: AddEmployeeError,
  } = useMutation({
    mutationFn: addEmployee,
    onSuccess: () => {
      queryCLient.invalidateQueries({ queryKey: ["employees", params] });
    },
  });
  const {
    mutate: updateEmployeeMutation,
    isError: updateEmployeeIsError,
    isPending: updateEmployeeIsPending,
    error: updateEmployeeError,
  } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AddEmployeeFormFIelds }) =>
      updateEmployee(id, data),
    onSuccess: () => {
      queryCLient.invalidateQueries({ queryKey: ["employees", params] });
    },
  });
  const {
    mutate: DeleteEMployeeMutation,
    isPending: DeleteEMployeeIsPending,
    isError: DeleteEMployeeIsError,
    error: DeleteEMployeeError,
  } = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryCLient.invalidateQueries({ queryKey: ["employees", params] });
    },
  });
  return {
    employees: data?.data,
    pagination: data
      ? {
          totalPages: data.totalPages,
          currentPage: data.page,
          limit: data.limit,
          results: data.results,
        }
      : undefined,
    isLoading,
    isError,
    error,
    refetch,
    AddEmployeeMutation,
    AddEmployeeIsError,
    AddEmpoyeeIsPending,
    AddEmployeeError,
    updateEmployeeMutation,
    updateEmployeeIsError,
    updateEmployeeIsPending,
    updateEmployeeError,
    DeleteEMployeeMutation,
    DeleteEMployeeIsPending,
    DeleteEMployeeIsError,
    DeleteEMployeeError,
  };
}
