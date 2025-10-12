import { showToast } from "@/lib/showToast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

const useDeleteMutation = (queryKey, deleteEndPoint) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ ids, deleteType }) => {
      const { data: response } = await axios({
        url: deleteEndPoint,
        method: deleteType === "PD" ? "DELETE" : "PUT",
        data: { ids, deleteType },
      })

      if (!response.success) {
        throw new Error(response.message)
      }

      return response
    },

    onSuccess: (data) => {
        showToast({ message: data.message, type: "success" })
      queryClient.invalidateQueries({ queryKey: [queryKey] }) // ✅ Correct
    },

    onError: (error) => {
      showToast({
        message: error?.response?.data?.message || error.message,
        type: "error",
      })
    },
  })
}


export default useDeleteMutation