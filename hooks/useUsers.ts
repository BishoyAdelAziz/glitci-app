import {
  AddUser,
  DeleteUser,
  getUsers,
  UpdateUser,
} from "@/services/api/users";
import { UsersEmployeesQueryParamsuery } from "@/types/users";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
interface Props {
  id?: string | null;
}
export default function UseUsers(params?: UsersEmployeesQueryParamsuery) {
  const queryClient = useQueryClient();
  const {
    data: Users,
    isLoading: UsersIsLoading,
    isError: UsersIsError,
    error: UsersError,
  } = useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
  });
  const {
    mutate: AddUserMuatate,
    isPending: AddUserIsPending,
    isError: AddUserIsError,
    error: AddUserError,
  } = useMutation({
    mutationFn: AddUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
  const {
    mutate: UpdateUserMutate,
    isPending: UpdateUserIsPending,
    isError: UpdateUserIsError,
    error: UpdateUserError,
  } = useMutation({
    mutationFn: UpdateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
  const {
    mutate: DeleteUserMutate,
    isPending: DeleteUserIsPending,
    isError: DeleteUserIsError,
    error: DeleteUserError,
  } = useMutation({
    mutationFn: DeleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
  return {
    Users,
    UsersIsLoading,
    UsersIsError,
    UsersError,
    AddUserMuatate,
    AddUserIsPending,
    AddUserIsError,
    AddUserError,
    UpdateUserMutate,
    UpdateUserIsPending,
    UpdateUserIsError,
    UpdateUserError,
    DeleteUserMutate,
    DeleteUserIsPending,
    DeleteUserIsError,
    DeleteUserError,
  };
}
