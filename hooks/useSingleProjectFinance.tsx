import { getSingleProjectFinance } from "@/services/api/SingleProject";
import { useQuery } from "@tanstack/react-query";
import { ParamValue } from "next/dist/server/request/params";
interface Props{
    projectId: ParamValue
}
export default function useSingleProjectFinance({projectId}:Props) {
    const {data,isLoading,isError} = useQuery({
        queryKey:["single-project-finance"],
        queryFn:()=>getSingleProjectFinance(projectId),
    })  
    return{
        data,isLoading,isError
    }
}