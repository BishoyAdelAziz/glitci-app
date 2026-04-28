import { getSingleProjectClientPaymentHistory, getSingleProjectEmployeesBreakDown, getSingleProjectExpensesBreakDown, getSingleProjectFinance } from "@/services/api/SingleProject";
import { useQuery } from "@tanstack/react-query";
import { ParamValue } from "next/dist/server/request/params";
interface Props{
    projectId: ParamValue
}
export default function useSingleProjectFinance({projectId}:Props) {
    const {data:SingleProjectFinance,isLoading:SingleProjectFinanceIsLoading,isError:SingleProjectFinanceIsError} = useQuery({
        queryKey:["single-project-finance"],
        queryFn:()=>getSingleProjectFinance(projectId),
    })  
    const {data:SingleProjectEmployeesBreakDown,isLoading:SingleProjectEmployeesBreakDownIsLoading,isError:SingleProjectEmployeesBreakDownIsError} = useQuery({
        queryKey:["single-project-employees-breakdown"],
        queryFn:()=>getSingleProjectEmployeesBreakDown(projectId),
    })
    const {data:SingleProjectExpensesBreakDown,isLoading:SingleProjectExpensesBreakDownIsLoading,isError:SingleProjectExpensesBreakDownIsError} = useQuery({
        queryKey:["single-project-expenses-breakdown"],
        queryFn:()=>getSingleProjectExpensesBreakDown(projectId),
    })
    const {data:SingleProjectClientPaymentHistory,isLoading:SingleProjectClientPaymentHistoryIsLoading,isError:SingleProjectClientPaymentHistoryIsError} = useQuery({
        queryKey:["single-project-client-payment-history"],
        queryFn:()=>getSingleProjectClientPaymentHistory(projectId),
    })
    return{
        SingleProjectFinance,SingleProjectFinanceIsLoading,SingleProjectFinanceIsError,
        SingleProjectEmployeesBreakDown,SingleProjectEmployeesBreakDownIsLoading,SingleProjectEmployeesBreakDownIsError,
        SingleProjectExpensesBreakDown,SingleProjectExpensesBreakDownIsLoading,SingleProjectExpensesBreakDownIsError,
        SingleProjectClientPaymentHistory,SingleProjectClientPaymentHistoryIsLoading,SingleProjectClientPaymentHistoryIsError
    }
}   