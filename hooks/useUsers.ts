import { getUsers } from "@/services/api/users";
import { useQuery,useMutation } from "@tanstack/react-query";

export default function UseUsers(){
    const {data:Users,isLoading:UsersIsLoading,isError:UsersIsError,error:UsersError} = useQuery({
        queryKey:["users"],
        queryFn: getUsers
    })
    return {Users,UsersIsLoading,UsersIsError,UsersError}
}